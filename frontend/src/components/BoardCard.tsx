import "./../styles/board-card.css";

import { useNavigate } from "react-router-dom";

import type { Board } from "../types/board";

interface Props {
    board: Board;
}

export default function BoardCard({ board }: Props) {
    const navigate = useNavigate();

    return (
        <div
            className="board-card"
            onClick={() => navigate(`/boards/${board.id}`)}
        >
            <h2 className="board-card__title">
                {board.title}
            </h2>

            <p className="board-card__description">
                {board.description || "No description"}
            </p>

            <div className="board-card__footer">
                <div className="board-card__arrow">
                    →
                </div>
            </div>
        </div>
    );
}