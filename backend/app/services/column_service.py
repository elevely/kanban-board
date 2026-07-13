from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.board import Board
from app.models.column import BoardColumn
from app.models.user import User
from app.schemas.column import ColumnCreate, ColumnUpdate


def create_column(db: Session, user: User, board_id: int, data: ColumnCreate):
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

    position = len(board.columns)

    column = BoardColumn(
        title=data.title,
        position=position,
        board_id=board.id,
    )

    db.add(column)
    db.commit()
    db.refresh(column)

    return column


def get_columns(db: Session, user: User, board_id: int):
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

    return (
        db.query(BoardColumn)
        .filter(BoardColumn.board_id == board.id)
        .order_by(BoardColumn.position)
        .all()
    )


def update_column(db: Session, user: User, column_id: int, data: ColumnUpdate):
    column = (
        db.query(BoardColumn)
        .join(Board)
        .filter(
            BoardColumn.id == column_id,
            Board.owner_id == user.id,
        )
        .first()
    )

    if column is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Column not found",
        )

    column.title = data.title

    db.commit()
    db.refresh(column)

    return column


def delete_column(db: Session, user: User, column_id: int):
    column = (
        db.query(BoardColumn)
        .join(Board)
        .filter(
            BoardColumn.id == column_id,
            Board.owner_id == user.id,
        )
        .first()
    )

    if column is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Column not found",
        )

    db.delete(column)
    db.commit()