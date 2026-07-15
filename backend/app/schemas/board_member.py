from pydantic import BaseModel


class BoardMemberCreate(BaseModel):
    username: str
    role: str


class BoardMemberUpdate(BaseModel):
    role: str


class BoardMemberResponse(BaseModel):
    id: int
    board_id: int
    user_id: int
    role: str

    class Config:
        from_attributes = True

class MyRoleResponse(BaseModel):
    role: str