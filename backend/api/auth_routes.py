from fastapi import APIRouter, HTTPException
from backend.models.user_model import User, Login
from backend.services.auth_service import create_user, login_user

router = APIRouter()

@router.post("/register")
def register(user: User):
    print("Received:", user.dict())
    result = create_user(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/login")
def login(user: Login):
    result = login_user(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result