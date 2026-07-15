from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models.user import User
from app.models.board import Board
from app.models.column import BoardColumn
from app.models.card import Card
from app.models.board_member import BoardMember

from app.routers.auth import router as auth_router
from app.routers.boards import router as boards_router
from app.routers.columns import router as columns_router
from app.routers.cards import router as cards_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kanban Board API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(boards_router)
app.include_router(columns_router)
app.include_router(cards_router)


@app.get("/")
def root():
    return {"message": "Kanban Board API is running"}