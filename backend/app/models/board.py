from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(150), nullable=False)

    description = Column(String(500))

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    owner = relationship(
        "User",
        back_populates="boards",
    )

    columns = relationship(
        "BoardColumn",
        back_populates="board",
        cascade="all, delete-orphan",
    )

    members = relationship(
        "BoardMember",
        back_populates="board",
        cascade="all, delete-orphan",
    )