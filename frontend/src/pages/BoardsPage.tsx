import { useEffect, useState } from "react";

import { createBoard, getBoards } from "../api/boards";

import type { Board } from "../types/board";

import BoardCard from "../components/BoardCard";

export default function BoardsPage() {
    const [boards, setBoards] = useState<Board[]>([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        loadBoards();
    }, []);

    async function loadBoards() {
        const data = await getBoards();
        setBoards(data);
    }

    async function handleCreateBoard() {
        if (!title.trim()) return;

        const board = await createBoard(
            title,
            description,
        );

        setBoards((prev) => [...prev, board]);

        setTitle("");
        setDescription("");
    }

    return (
        <div
            style={{
                maxWidth: 900,
                margin: "40px auto",
                color: "white",
            }}
        >
            <h1
                style={{
                    marginBottom: 30,
                }}
            >
                My Boards
            </h1>

            <div
                style={{
                    background: "#1e293b",
                    padding: 20,
                    borderRadius: 12,
                    marginBottom: 30,
                }}
            >
                <input
                    placeholder="Board title"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: 10,
                        marginBottom: 10,
                    }}
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: 10,
                        marginBottom: 10,
                    }}
                />

                <button
                    onClick={handleCreateBoard}
                    style={{
                        padding: "10px 20px",
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                    }}
                >
                    Create Board
                </button>
            </div>

            {boards.map((board) => (
                <BoardCard
                    key={board.id}
                    board={board}
                />
            ))}
        </div>
    );
}