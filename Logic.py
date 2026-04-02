from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
import bcrypt
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db["credentials"]

# Hash password
def hash_password(password: str):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

# Request body structure
class Credential(BaseModel):
    email: EmailStr
    password: str
    account: str

@app.post("/save-credentials")
def save_credentials(cred: Credential):
    # Validate input
    if not cred.email or not cred.password or not cred.account:
        raise HTTPException(status_code=400, detail="Missing fields")

    # Check if email already exists
    existing_user = collection.find_one({"email": cred.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Create new record
    new_data = {
        "account": cred.account,
        "email": cred.email,
        "password": hash_password(cred.password)
    }

    # Insert into MongoDB
    collection.insert_one(new_data)

    return {"message": "Password Saved"}