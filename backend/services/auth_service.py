from db.database import db
from core.security import hash_password, verify_password, create_access_token
from datetime import datetime

def create_user(user):
    collection = db["users"]
    existing = collection.find_one({"email": user.email})
    if existing:
        return {"error": "User already exists"}

    new_user = {
        "email": user.email,
        "password": hash_password(user.password),
        "account": user.account,
        "created_at": datetime.utcnow()
    }
    collection.insert_one(new_user)
    return {"message": "User created successfully"}

def login_user(user):
    collection = db["users"]
    db_user = collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        return {"error": "Invalid credentials"}

    token = create_access_token({"email": db_user["email"]})
    return {"message": "Login successful", "token": token}