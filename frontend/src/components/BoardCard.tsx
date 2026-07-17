import "./../styles/board-card.css";

import { useNavigate } from "react-router-dom";

import type { Board } from "../types/board";

interface Props {
    board: Board;
    view: "grid" | "list";
}

export default function BoardCard({
    board,
    view,
}: Props) {
    const navigate = useNavigate();

    return (
        <div
            className={`board-card board-card--${view}`}
            onClick={() => navigate(`/boards/${board.id}`)}
        >
            <div className="board-card__content">
                <h2 className="board-card__title">
                    {board.title}
                </h2>

                <p className="board-card__description">
                    {board.description || "No description"}
                </p>
            </div>

            <div className="board-card__footer">
                {view === "list" && (
                    <span className="board-role">
                        {board.my_role}
                    </span>
                )}

                <div className="board-card__arrow">
                    →
                </div>
            </div>
        </div>
    );
}