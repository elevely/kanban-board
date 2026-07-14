from typing import Optional

from pydantic import BaseModel


class CardCreate(BaseModel):
    title: str
    description: Optional[str] = None


class CardUpdate(BaseModel):
    title: str
    description: Optional[str] = None


class CardResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    position: int
    column_id: int

    class Config:
        from_attributes = True

class CardMove(BaseModel):
    column_id: int
    position: int