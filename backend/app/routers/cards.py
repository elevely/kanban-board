from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.card import CardCreate, CardUpdate, CardResponse, CardMove
from app.services import card_service

router = APIRouter(tags=["Cards"])


@router.post(
    "/columns/{column_id}/cards",
    response_model=CardResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_card(
    column_id: int,
    data: CardCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return card_service.create_card(db, current_user, column_id, data)


@router.get(
    "/columns/{column_id}/cards",
    response_model=List[CardResponse],
)
def get_cards(
    column_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return card_service.get_cards(db, current_user, column_id)


@router.patch(
    "/cards/{card_id}",
    response_model=CardResponse,
)
def update_card(
    card_id: int,
    data: CardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return card_service.update_card(db, current_user, card_id, data)


@router.delete(
    "/cards/{card_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_card(
    card_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    card_service.delete_card(db, current_user, card_id)

@router.patch(
    "/cards/{card_id}/move",
    response_model=CardResponse,
)
def move_card(
    card_id: int,
    data: CardMove,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return card_service.move_card(
        db,
        current_user,
        card_id,
        data,
    )