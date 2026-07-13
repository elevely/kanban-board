from fastapi import FastAPI

from app.database import Base, engine

from app.models.user import User
from app.models.board import Board
from app.models.column import BoardColumn

from app.routers.auth import router as auth_router
from app.routers.boards import router as boards_router
from app.routers.columns import router as columns_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kanban Board API",
    version="0.1.0",
)

app.include_router(auth_router)
app.include_router(boards_router)
app.include_router(columns_router)


@app.get("/")
def root():
    return {"message": "Kanban Board API is running"}