# Optional helpers
# You can use this for type hints or initial document templates

user_schema = {
    "username": str,
    "email": str,
    "password": str,  # hashed
    "number": str
}

chat_schema = {
    "user_id": str,
    "date": None,
    "question": str,
    "answer": str
}
