from pydantic import BaseModel

class SavedCredential(BaseModel):
    account: str
    username: str
    password: str