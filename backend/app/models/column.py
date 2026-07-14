from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class BoardColumn(Base):
    __tablename__ = "columns"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(100), nullable=False)

    position = Column(Integer, nullable=False)

    board_id = Column(
        Integer,
        ForeignKey("boards.id"),
        nullable=False,
    )

    board = relationship(
        "Board",
        back_populates="columns",
    )

    cards = relationship(
        "Card",
        back_populates="column",
        cascade="all, delete-orphan",
    )