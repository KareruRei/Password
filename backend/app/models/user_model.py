from pydantic import BaseModel, EmailStr, Field, validator


class User(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    account: str

    @validator("password")
    def strong_password(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v


class Login(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)