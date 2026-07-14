from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    description = Column(Text)

    position = Column(Integer, nullable=False)

    column_id = Column(
        Integer,
        ForeignKey("columns.id"),
        nullable=False,
    )

    column = relationship(
        "BoardColumn",
        back_populates="cards",
    )