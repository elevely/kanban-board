from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.board import (
    BoardCreate,
    BoardResponse,
    BoardUpdate,
)
from app.schemas.board_member import (
    BoardMemberCreate,
    BoardMemberResponse,
    BoardMemberUpdate,
    MyRoleResponse,
)
from app.services import board_service

router = APIRouter(
    prefix="/boards",
    tags=["Boards"],
)


@router.post(
    "/",
    response_model=BoardResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_board(
    data: BoardCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return board_service.create_board(
        db,
        current_user,
        data,
    )


@router.get(
    "/",
    response_model=List[BoardResponse],
)
def get_boards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return board_service.get_boards(
        db,
        current_user,
    )

@router.get(
    "/{board_id}",
    response_model=BoardResponse,
)
def get_board(
    board_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return board_service.get_board(
        db,
        current_user,
        board_id,
    )

@router.get(
    "/{board_id}/my-role",
    response_model=MyRoleResponse,
)
def get_my_role(
    board_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return board_service.get_my_role(
        db,
        board_id,
        current_user.id,
    )


@router.patch(
    "/{board_id}",
    response_model=BoardResponse,
)
def update_board(
    board_id: int,
    data: BoardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return board_service.update_board(
        db,
        current_user,
        board_id,
        data,
    )


@router.delete(
    "/{board_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_board(
    board_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    board_service.delete_board(
        db,
        current_user,
        board_id,
    )

@router.get(
    "/{board_id}/members",
    response_model=List[BoardMemberResponse],
)
def get_members(
    board_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return board_service.get_members(
        db,
        board_id,
    )


@router.post(
    "/{board_id}/members",
    response_model=BoardMemberResponse,
)
def add_member(
    board_id: int,
    data: BoardMemberCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    board_service.require_owner(
        db,
        board_id,
        current_user.id,
    )

    return board_service.add_member(
        db,
        board_id,
        data,
    )


@router.patch(
    "/{board_id}/members/{user_id}",
    response_model=BoardMemberResponse,
)
def update_member_role(
    board_id: int,
    user_id: int,
    data: BoardMemberUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    board_service.require_owner(
        db,
        board_id,
        current_user.id,
    )

    return board_service.update_member_role(
        db,
        board_id,
        user_id,
        data,
    )

@router.delete(
    "/{board_id}/members/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_member(
    board_id: int,
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    board_service.require_owner(
        db,
        board_id,
        current_user.id,
    )

    board_service.remove_member(
        db,
        board_id,
        user_id,
    )