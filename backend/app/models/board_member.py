from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class BoardMember(Base):
    __tablename__ = "board_members"

    id = Column(Integer, primary_key=True)

    board_id = Column(
        Integer,
        ForeignKey("boards.id", ondelete="CASCADE"),
        nullable=False,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    role = Column(
        String(20),
        nullable=False,
        default="viewer",
    )

    board = relationship(
        "Board",
        back_populates="members",
    )

    user = relationship(
        "User",
        back_populates="memberships",
    )