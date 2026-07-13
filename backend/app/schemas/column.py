from typing import Optional

from pydantic import BaseModel


class ColumnCreate(BaseModel):
    title: str


class ColumnUpdate(BaseModel):
    title: str


class ColumnResponse(BaseModel):
    id: int
    title: str
    position: int
    board_id: int

    class Config:
        from_attributes = True