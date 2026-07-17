import { useEffect, useState } from "react";

import { createBoard, getBoards } from "../api/boards";

import type { Board } from "../types/board";

import BoardCard from "../components/BoardCard";

import Header from "../components/layout/Header";

import "../styles/boards-page.css";

export default function BoardsPage() {
    const [boards, setBoards] = useState<Board[]>([]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);

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
        <>
            <Header />

            <div className="boards-page">
                <div className="boards-header">
                    <h1 className="boards-title">
                        My Boards
                    </h1>

                    <p className="boards-subtitle">
                        Organize your projects in one place.
                    </p>
                </div>

                <div className="boards-toolbar">
                    <button 
                        className="new-board-button"
                        onClick={() => setIsCreateOpen(true)}    
                    >
                        + New Board
                    </button>
                </div>

                <h2 className="projects-title">
                    Projects
                </h2>

                {boards.length === 0 ? (
                    <div className="empty-state">
                        <button
                            className="empty-plus"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            +
                        </button>
                        <h2>No boards yet</h2>

                        <p>
                            Create your first board to start managing your projects.
                        </p>
                    </div>
                ) : (
                    <div className="boards-grid">
                        {boards.map((board) => (
                            <BoardCard
                                key={board.id}
                                board={board}
                            />
                        ))}
                    </div>
                )}

                {isCreateOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Create Board</h2>

                        <input
                            placeholder="Board title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />

                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                        <div className="modal-actions">
                            <button
                                className="modal-cancel"
                                onClick={() =>
                                    setIsCreateOpen(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="modal-create"
                                onClick={async () => {
                                    await handleCreateBoard();

                                    setIsCreateOpen(false);
                                }}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            </div>
        </>
    );
}