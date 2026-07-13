from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.board import Board
from app.models.user import User
from app.schemas.board import BoardCreate, BoardUpdate


def create_board(db: Session, user: User, data: BoardCreate):
    board = Board(
        title=data.title,
        description=data.description,
        owner_id=user.id,
    )

    db.add(board)
    db.commit()
    db.refresh(board)

    return board


def get_boards(db: Session, user: User):
    return (
        db.query(Board)
        .filter(Board.owner_id == user.id)
        .all()
    )


def get_board(db: Session, user: User, board_id: int):
    board = (
        db.query(Board)
        .filter(
            Board.id == board_id,
            Board.owner_id == user.id,
        )
        .first()
    )

    if board is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found",
        )

    return board


def update_board(db: Session, user: User, board_id: int, data: BoardUpdate):
    board = get_board(db, user, board_id)

    board.title = data.title
    board.description = data.description

    db.commit()
    db.refresh(board)

    return board


def delete_board(db: Session, user: User, board_id: int):
    board = get_board(db, user, board_id)

    db.delete(board)
    db.commit()