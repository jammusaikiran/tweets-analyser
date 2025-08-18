import os
import re
import tempfile
from datetime import datetime

from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from pymongo import MongoClient
from bson import ObjectId
load_dotenv()

import google.generativeai as genai
from werkzeug.utils import secure_filename

# --- Lightweight sentiment: VADER (no NLTK download needed) ---
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# -------------------------------
# Flask App Setup
# -------------------------------
app = Flask(__name__)

FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "https://electomate.netlify.app")

app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]
app.config["MONGO_URI"] = os.environ["MONGO_URI"]
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

# CORS(app, origins=[FRONTEND_ORIGIN, "http://localhost:5173"], supports_credentials=True)
CORS(app, origins=[FRONTEND_ORIGIN], supports_credentials=True)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# -------------------------------
# MongoDB Setup
# -------------------------------
mongo_client = MongoClient(app.config["MONGO_URI"])
db = mongo_client["p_llm"]
users_col = db["users"]
chats_col = db["chats"]

# -------------------------------
# Gemini Setup
# -------------------------------
genai.configure(api_key=GEMINI_API_KEY)
_gemini_model = genai.GenerativeModel("gemini-1.5-flash")

def ask_gemini(prompt: str) -> str:
    """
    Election-only guard + Gemini response.
    """
    try:
        system_guard = (
            "You are an AI psephology assistant. You must answer only queries related to "
            "elections, voting, parties, candidates, constituencies, or electoral history/policy. "
            "If the query is unrelated, reply exactly: 'I can only answer election-related queries.'"
        )
        full_prompt = f"{system_guard}\n\nUser query: {prompt}"
        resp = _gemini_model.generate_content(full_prompt)
        txt = (resp.text or "").strip()
        if not txt:
            return "I can only answer election-related queries."
        return txt
    except Exception as e:
        print("Gemini Error:", e)
        return "Sorry, I'm facing issues fetching the answer. Please try again later."

# -------------------------------
# Parties & Sentiment (in-memory, no disk)
# -------------------------------
PARTIES = ['BJP', 'Congress', 'AAP', 'TMC', 'SP', 'BSP', 'ShivSena', 'NCP', 'RJD', 'JD(U)']
PARTY_PATTERNS = {p: re.compile(rf"\b{re.escape(p)}\b", re.IGNORECASE) for p in PARTIES}
party_counts = {p: {'positive': 0, 'neutral': 0, 'negative': 0} for p in PARTIES}
vader = SentimentIntensityAnalyzer()

def label_sentiment(text: str) -> str:
    score = vader.polarity_scores(text or "")
    if score["compound"] > 0.05:
        return "positive"
    elif score["compound"] < -0.05:
        return "negative"
    else:
        return "neutral"

def parties_in_text(text: str):
    hits = []
    for party, pat in PARTY_PATTERNS.items():
        if pat.search(text or ""):
            hits.append(party)
    return hits

# ======================================================
# ==============  AUTH & USER ROUTES  ==================
# ======================================================
@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json(force=True)
        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""
        number = data.get("number") or ""

        if not username or not email or not password:
            return jsonify({"msg": "username, email, and password are required"}), 400

        if users_col.find_one({"username": username}):
            return jsonify({"msg": "Username already exists"}), 400
        if users_col.find_one({"email": email}):
            return jsonify({"msg": "Email already exists"}), 400

        hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
        user_id = users_col.insert_one({
            "username": username,
            "email": email,
            "password": hashed_pw,
            "number": number
        }).inserted_id

        return jsonify({"msg": "User created", "user_id": str(user_id)}), 201
    except Exception as e:
        print("Error in /api/register:", e)
        return jsonify({"msg": "Internal Server Error", "error": str(e)}), 500

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    user = users_col.find_one({"username": username})
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user["_id"]))
    return jsonify({"access_token": access_token, "username": user["username"]})

# ======================================================
# ==================  CHAT ROUTES  =====================
# ======================================================
@app.route("/api/chat/history", methods=["GET"])
@jwt_required()
def get_chat_history():
    user_id = get_jwt_identity()
    chats = list(chats_col.find({"user_id": user_id}).sort("date", 1))
    result = [{
        "question": c.get("question"),
        "answer": c.get("answer"),
        "date": c.get("date")
    } for c in chats]
    return jsonify(result)

@app.route("/api/chat", methods=["POST"])
@jwt_required()
def chat():
    user_id = get_jwt_identity()
    data = request.get_json(force=True)
    user_question = (data.get("userInput") or "").strip()

    if not user_question:
        return jsonify({"response": "Please provide a question."}), 400

    bot_answer = ask_gemini(user_question)

    chat_doc = {
        "user_id": user_id,
        "date": datetime.utcnow(),
        "question": user_question,
        "answer": bot_answer
    }
    chats_col.insert_one(chat_doc)
    return jsonify({"response": bot_answer})

@app.route("/api/chat/delete", methods=["DELETE"])
@jwt_required()
def delete_chat():
    user_id = get_jwt_identity()
    chats_col.delete_many({"user_id": user_id})
    return jsonify({"msg": "Chat history deleted"})

# ======================================================
# ==============  SENTIMENT ROUTES  ====================
# ======================================================
@app.route('/add_tweets', methods=['POST'])
def add_tweets_endpoint():
    payload = request.get_json(silent=True) or {}
    tweets = payload.get("tweets")
    if not isinstance(tweets, list) or len(tweets) == 0:
        return jsonify({'error': 'No tweets provided'}), 400

    accepted = 0
    rejected = 0

    for t in tweets:
        text = (t or "").strip()
        if not text:
            rejected += 1
            continue
        hits = parties_in_text(text)
        if not hits:
            rejected += 1
            continue
        label = label_sentiment(text)
        for party in hits:
            party_counts[party][label] += 1
        accepted += 1

    if accepted == 0:
        return jsonify({'error': 'Only election party tweets are accepted. Please submit tweets related to election parties.'}), 400

    return jsonify({'message': f'Tweets added successfully', 'accepted': accepted, 'rejected': rejected}), 200

@app.route('/get_sentiment_data', methods=['GET'])
def get_sentiment_data():
    data = [
        {
            "name": party,
            "positive": counts["positive"],
            "neutral": counts["neutral"],
            "negative": counts["negative"]
        }
        for party, counts in party_counts.items()
    ]
    return jsonify(data), 200

@app.route('/reset_sentiments', methods=['POST'])
def reset_sentiments():
    for p in party_counts:
        party_counts[p] = {'positive': 0, 'neutral': 0, 'negative': 0}
    return jsonify({"msg": "Sentiments cleared"}), 200

# ======================================================
# ==============  UPLOAD IMAGE ROUTE  ==================
# ======================================================
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File format not supported"}), 400

    try:
        filename = secure_filename(file.filename)
        with tempfile.NamedTemporaryFile(delete=False, suffix=filename) as tmp:
            file.save(tmp.name)
            image_path = tmp.name

        prompt = (
            "Please extract and provide comprehensive details about the political party depicted "
            "in the image, including: Party Name, Founder, Year of Establishment, Years in Power, "
            "Number of Sitting Legislative Members, Number of Parliamentary Members, Popular Schemes "
            "Implemented, and Current Ministers from the Party. Ensure the information is well-organized "
            "with clear headings and subheadings. If the provided image does not contain information "
            "related to political parties or if the party does not belong to India, reply strictly: "
            "'It is not an Indian political party.'"
        )

        resp = _gemini_model.generate_content([prompt, genai.upload_file(path=image_path)])
        output_text = (resp.text or "").strip()
        output_list = [line for line in output_text.split("\n") if line.strip()]

        return jsonify({"result": output_list}), 200

    except Exception as e:
        print("Upload error:", e)
        return jsonify({"error": "Error processing file"}), 500

# -------------------------------
# Health
# -------------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

# -------------------------------
# Main
# -------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port,debug=True)
