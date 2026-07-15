from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.board import Board
from app.models.card import Card
from app.models.column import BoardColumn
from app.models.user import User

from app.schemas.card import CardCreate, CardUpdate, CardMove

from app.services.board_service import get_board, require_editor


def create_card(db: Session, user: User, column_id: int, data: CardCreate):
    column = (
        db.query(BoardColumn)
        .filter(
            BoardColumn.id == column_id,
        )
        .first()
    )

    if column is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Column not found",
        )

    get_board(
        db,
        user,
        column.board_id,
    )

    require_editor(
        db,
        column.board_id,
        user.id,
    )

    position = len(column.cards)

    card = Card(
        title=data.title,
        description=data.description,
        position=position,
        column_id=column.id,
    )

    db.add(card)
    db.commit()
    db.refresh(card)

    return card


def get_cards(db: Session, user: User, column_id: int):
    column = (
        db.query(BoardColumn)
        .filter(
            BoardColumn.id == column_id,
        )
        .first()
    )

    if column is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Column not found",
        )

    get_board(
        db,
        user,
        column.board_id,
    )

    return (
        db.query(Card)
        .filter(Card.column_id == column.id)
        .order_by(Card.position)
        .all()
    )


def update_card(
    db: Session,
    user: User,
    card_id: int,
    data: CardUpdate,
):
    card = (
        db.query(Card)
        .filter(
            Card.id == card_id,
        )
        .first()
    )

    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found",
        )

    get_board(
        db,
        user,
        card.column.board_id,
    )

    require_editor(
        db,
        card.column.board_id,
        user.id,
    )

    card.title = data.title
    card.description = data.description

    db.commit()
    db.refresh(card)

    return card


def delete_card(
    db: Session,
    user: User,
    card_id: int,
):
    card = (
        db.query(Card)
        .filter(
            Card.id == card_id,
        )
        .first()
    )

    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found",
        )

    get_board(
        db,
        user,
        card.column.board_id,
    )

    require_editor(
        db,
        card.column.board_id,
        user.id,
    )

    db.delete(card)
    db.commit()

def move_card(
    db: Session,
    user: User,
    card_id: int,
    data: CardMove,
):
    card = (
        db.query(Card)
        .filter(
            Card.id == card_id,
        )
        .first()
    )

    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found",
        )

    get_board(
        db,
        user,
        card.column.board_id,
    )

    require_editor(
        db,
        card.column.board_id,
        user.id,
    )

    new_column = (
        db.query(BoardColumn)
        .filter(
            BoardColumn.id == data.column_id,
        )
        .first()
    )

    if new_column is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Column not found",
        )

    get_board(
        db,
        user,
        new_column.board_id,
    )

    card.column_id = new_column.id
    card.position = data.position

    db.commit()
    db.refresh(card)

    return card