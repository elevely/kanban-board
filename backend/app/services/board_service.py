from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.board import Board
from app.models.user import User
from app.models.board_member import BoardMember
from app.models.board_member import BoardMember

from app.schemas.board_member import (
    BoardMemberCreate,
    BoardMemberUpdate,
)
from app.schemas.board import BoardCreate, BoardUpdate

def get_member(
    db: Session,
    board_id: int,
    user_id: int,
):
    return (
        db.query(BoardMember)
        .filter(
            BoardMember.board_id == board_id,
            BoardMember.user_id == user_id,
        )
        .first()
    )

def get_members(
    db: Session,
    board_id: int,
):
    members = (
        db.query(BoardMember)
        .filter(BoardMember.board_id == board_id)
        .all()
    )

    result = []

    for member in members:
        result.append({
            "id": member.id,
            "board_id": member.board_id,
            "user_id": member.user_id,
            "role": member.role,
            "username": member.user.username,
        })

    return result

def create_board(
    db: Session,
    user: User,
    data: BoardCreate,
):
    board = Board(
        title=data.title,
        description=data.description,
        owner_id=user.id,
    )

    db.add(board)
    db.commit()
    db.refresh(board)

    member = BoardMember(
        board_id=board.id,
        user_id=user.id,
        role="owner",
    )

    db.add(member)
    db.commit()

    return board


def get_boards(db: Session, user: User):
    boards = (
        db.query(Board)
        .join(
            BoardMember,
            Board.id == BoardMember.board_id,
        )
        .filter(
            BoardMember.user_id == user.id,
        )
        .all()
    )

    for board in boards:
        member = (
            db.query(BoardMember)
            .filter(
                BoardMember.board_id == board.id,
                BoardMember.user_id == user.id,
            )
            .first()
        )

        board.my_role = member.role

    return boards


def get_board(
    db: Session,
    user: User,
    board_id: int,
):
    member = get_member(
        db,
        board_id,
        user.id,
    )

    if member is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )

    board = (
        db.query(Board)
        .filter(Board.id == board_id)
        .first()
    )

    if board is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found",
        )

    board.my_role = member.role

    return board

def require_owner(
    db: Session,
    board_id: int,
    user_id: int,
):
    member = (
        db.query(BoardMember)
        .filter(
            BoardMember.board_id == board_id,
            BoardMember.user_id == user_id,
        )
        .first()
    )

    if member is None or member.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owner can perform this action",
        )

def update_board(
    db: Session,
    user: User,
    board_id: int,
    data: BoardUpdate,
):
    require_owner(
        db,
        board_id,
        user.id,
    )

    board = get_board(
        db,
        user,
        board_id,
    )

    board.title = data.title
    board.description = data.description

    db.commit()
    db.refresh(board)

    return board


def delete_board(
    db: Session,
    user: User,
    board_id: int,
):
    require_owner(
        db,
        board_id,
        user.id,
    )

    board = get_board(
        db,
        user,
        board_id,
    )

    db.delete(board)
    db.commit()

def add_member(
    db: Session,
    board_id: int,
    data: BoardMemberCreate,
):
    user = (
        db.query(User)
        .filter(User.username == data.username)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    member = BoardMember(
        board_id=board_id,
        user_id=user.id,
        role=data.role,
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return member


def update_member_role(
    db: Session,
    board_id: int,
    user_id: int,
    data: BoardMemberUpdate,
):
    member = (
        db.query(BoardMember)
        .filter(
            BoardMember.board_id == board_id,
            BoardMember.user_id == user_id,
        )
        .first()
    )

    if member is None:
        raise HTTPException(
            status_code=404,
            detail="Member not found",
        )

    member.role = data.role

    db.commit()
    db.refresh(member)

    return member


def remove_member(
    db: Session,
    board_id: int,
    user_id: int,
):
    member = (
        db.query(BoardMember)
        .filter(
            BoardMember.board_id == board_id,
            BoardMember.user_id == user_id,
        )
        .first()
    )

    if member is None:
        raise HTTPException(
            status_code=404,
            detail="Member not found",
        )
    
    if member.role == "owner":
        raise HTTPException(
            status_code=400,
            detail="Owner cannot be removed",
        )

    db.delete(member)
    db.commit()

def require_editor(
    db: Session,
    board_id: int,
    user_id: int,
):
    member = (
        db.query(BoardMember)
        .filter(
            BoardMember.board_id == board_id,
            BoardMember.user_id == user_id,
        )
        .first()
    )

    if (
        member is None
        or member.role not in ["owner", "editor"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission",
        )

def get_my_role(
    db: Session,
    board_id: int,
    user_id: int,
):
    member = (
        db.query(BoardMember)
        .filter(
            BoardMember.board_id == board_id,
            BoardMember.user_id == user_id,
        )
        .first()
    )

    if member is None:
        raise HTTPException(
            status_code=404,
            detail="Member not found",
        )

    return {
        "role": member.role,
    }