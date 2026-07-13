from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.column import (
    ColumnCreate,
    ColumnUpdate,
    ColumnResponse,
)
from app.services import column_service

router = APIRouter(
    tags=["Columns"],
)


@router.post(
    "/boards/{board_id}/columns",
    response_model=ColumnResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_column(
    board_id: int,
    data: ColumnCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return column_service.create_column(
        db,
        current_user,
        board_id,
        data,
    )


@router.get(
    "/boards/{board_id}/columns",
    response_model=List[ColumnResponse],
)
def get_columns(
    board_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return column_service.get_columns(
        db,
        current_user,
        board_id,
    )


@router.patch(
    "/columns/{column_id}",
    response_model=ColumnResponse,
)
def update_column(
    column_id: int,
    data: ColumnUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return column_service.update_column(
        db,
        current_user,
        column_id,
        data,
    )


@router.delete(
    "/columns/{column_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_column(
    column_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    column_service.delete_column(
        db,
        current_user,
        column_id,
    )