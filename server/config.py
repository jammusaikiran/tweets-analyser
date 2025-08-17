import os

class Config:
    MONGO_URI = "mongodb+srv://jammusaikiran0:kiransai.@cluster0.ngs32.mongodb.net/authDB?retryWrites=true&w=majority&appName=Cluster0"
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "saikiran321")
