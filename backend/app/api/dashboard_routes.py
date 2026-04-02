from fastapi import APIRouter, Depends, HTTPException, Header
from app.db.database import db
from app.models.credential_model import SavedCredential
from app.core.security import decode_access_token, encrypt_value, decrypt_value
from datetime import datetime

router = APIRouter()

def get_current_user(authorization: str = Header(...)):
    token = authorization.split(" ")[1]  # Bearer <token>
    user = decode_access_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user["email"]

@router.get("/credentials")
def get_credentials(user_email: str = Depends(get_current_user)):
    collection = db["credentials"]
    creds = list(collection.find({"user_email": user_email}, {"_id": 0}))
    # decrypt password fields before returning
    out = []
    for c in creds:
        try:
            c_password = c.get("password")
            if c_password:
                c["password"] = decrypt_value(c_password)
        except Exception:
            # if decryption fails, leave the stored value but mark as unavailable
            c["password"] = "<encrypted>"
        out.append(c)
    return {"credentials": out}

@router.post("/credentials")
def add_credential(cred: SavedCredential, user_email: str = Depends(get_current_user)):
    collection = db["credentials"]
    new_cred = {
        "user_email": user_email,
        "account": cred.account,
        "username": cred.username,
        # encrypt password at rest
        "password": encrypt_value(cred.password),
        "created_at": datetime.utcnow()
    }
    collection.insert_one(new_cred)
    return {"message": "Credential added"}

@router.delete("/credentials/{account_name}")
def delete_credential(account_name: str, user_email: str = Depends(get_current_user)):
    collection = db["credentials"]
    result = collection.delete_one({"user_email": user_email, "account": account_name})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Credential not found")
    return {"message": "Credential deleted"}