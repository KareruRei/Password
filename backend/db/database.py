from pymongo import MongoClient
from core.config import MONGO_URI, DB_NAME

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
try:
	# Ensure common indexes exist (safe to call repeatedly)
	db["users"].create_index("email", unique=True)
	db["credentials"].create_index("user_email")
except Exception:
	# If index creation fails (e.g., missing env), don't crash app here.
	pass