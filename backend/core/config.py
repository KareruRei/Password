import os
from dotenv import load_dotenv

load_dotenv()

# Provide safe defaults for local development so the app doesn't crash
# when environment variables are not provided.
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "vaultdb")