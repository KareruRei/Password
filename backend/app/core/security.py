import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from cryptography.fernet import Fernet

load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")

# Fernet key for encrypting stored credentials. Keep this secret in env for production.
FERNET_KEY = os.getenv("FERNET_KEY")
if not FERNET_KEY:
    # generate a key for development if none provided (not persisted across restarts)
    FERNET_KEY = Fernet.generate_key().decode()

FERNET = Fernet(FERNET_KEY.encode())

# Password hashing
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

# JWT
def create_access_token(data: dict, expires_minutes=60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def encrypt_value(plain: str) -> str:
    """Encrypt a string value for storing in the database."""
    return FERNET.encrypt(plain.encode()).decode()


def decrypt_value(token: str) -> str:
    """Decrypt a previously encrypted string from the database."""
    return FERNET.decrypt(token.encode()).decode()