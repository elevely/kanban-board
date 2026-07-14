import { useNavigate } from "react-router-dom";

import type { Board } from "../types/board";

interface Props {
    board: Board;
}

export default function BoardCard({ board }: Props) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/boards/${board.id}`)}
            style={{
                background: "#1e293b",
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
                cursor: "pointer",
            }}
        >
            <h2>{board.title}</h2>

            <p>{board.description}</p>
        </div>
    );
}