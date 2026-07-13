from pydantic import BaseModel
from typing import Optional


class BoardCreate(BaseModel):
    title: str
    description: Optional[str] = None


class BoardUpdate(BaseModel):
    title: str
    description: Optional[str] = None

class BoardResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    owner_id: int

    class Config:
        from_attributes = True