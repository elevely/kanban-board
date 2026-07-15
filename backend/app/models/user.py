from sqlalchemy import Column, Integer, String

from app.database import Base

from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)

    boards = relationship(
        "Board",
        back_populates="owner",
    )

    memberships = relationship(
        "BoardMember",
        back_populates="user",
    )