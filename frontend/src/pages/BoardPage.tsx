import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import {
    DndContext,
    type DragEndEvent,
} from "@dnd-kit/core";

import { moveCard } from "../api/cards";
import { getCards } from "../api/cards";
import { createCard } from "../api/cards";
import {
    getColumns,
    createColumn,
    updateColumn,
    deleteColumn,
} from "../api/columns";
import {
    getBoard,
    updateBoard,
    deleteBoard,
} from "../api/boards";

import type { BoardColumn } from "../types/boardColumn";
import type { Board } from "../types/board";

import EditBoardModal from "../components/EditBoardModal";
import ColumnView from "../components/ColumnView";
import Header from "../components/layout/Header";


import "../styles/board-page.css";

export default function BoardPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [columns, setColumns] = useState<BoardColumn[]>([]);
    const [board, setBoard] = useState<Board | null>(null);
    const [title, setTitle] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

        loadBoard(Number(id));
        loadColumns(Number(id));
    }, [id]);

    async function loadColumns(boardId: number) {
        const columnsData = await getColumns(boardId);

        const boardColumns: BoardColumn[] = [];

        for (const column of columnsData) {
            const cards = await getCards(column.id);

            boardColumns.push({
                ...column,
                cards,
            });
        }

        setColumns(boardColumns);
    }

    async function loadBoard(boardId: number) {
        const data = await getBoard(boardId);

        setBoard(data);
    }

    async function handleCreateColumn() {
        if (!id || !title.trim()) return;

        const column = await createColumn(
            Number(id),
            title
        );

        setColumns((prev) => [
            ...prev,
            {
                ...column,
                cards: [],
            },
        ]);

        setTitle("");
    }

    return (
        <>
            <Header />

            <div className="board-page">
                <div className="board-page-header">
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}
                        >
                            <h1 className="board-page-title">
                                {board?.title}
                            </h1>
                            
                            <button
                                className="edit-board-button"
                                onClick={() => setIsEditOpen(true)}
                            >
                                Edit
                            </button>

                            <button
                                className="delete-board-button"
                                onClick={handleDeleteBoard}
                            >
                                Delete
                            </button>
                        </div>

                        <p className="board-page-subtitle">
                            {board?.description || "Manage your workflow."}
                        </p>
                    </div>

                    <div className="add-column">
                        <input
                            placeholder="Column title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />

                        <button
                            onClick={handleCreateColumn}
                        >
                            + New Column
                        </button>
                    </div>
                </div>

                <DndContext onDragEnd={handleDragEnd}>
                    <div className="columns">
                        {columns.map((column) => (
                            <ColumnView
                                key={column.id}
                                column={column}
                                onCreateCard={handleCreateCard}
                                onUpdateCard={handleUpdateCard}
                                onRenameColumn={handleRenameColumn}
                                onDeleteColumn={handleDeleteColumn}
                            />
                        ))}
                    </div>
                </DndContext>
            </div>

        <EditBoardModal
            board={board}
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleUpdateBoard}
        />

        </>
    );

    async function handleCreateCard(
        columnId: number,
        title: string,
    ) {
        if (!title.trim()) return;

        await createCard(
            columnId,
            title,
            "",
        );

        if (id) {
            await loadColumns(Number(id));
        }
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const updated = await moveCard(
            Number(active.id),
            Number(over.id),
            0,
        );

        console.log(updated);

        if (id) {
            loadColumns(Number(id));
        }
    }

    async function handleUpdateCard() {
        if (id) {
            await loadColumns(Number(id));
        }
    }

    async function handleUpdateBoard(
        title: string,
        description: string,
    ) {
        if (!board) return;

        const updated = await updateBoard(
            board.id,
            title,
            description,
        );

        setBoard(updated);
    }

    async function handleRenameColumn(
        columnId: number,
        title: string,
    ) {
        await updateColumn(
            columnId,
            title,
        );

        if (id) {
            await loadColumns(Number(id));
        }
    }

    async function handleDeleteColumn(
        columnId: number,
    ) {
        await deleteColumn(columnId);

        if (id) {
            await loadColumns(Number(id));
        }
    }

    async function handleDeleteBoard() {
        if (!board) return;

        const confirmed = window.confirm(
            "Delete this board?\n\nAll columns and cards will also be deleted."
        );

        if (!confirmed) return;

        await deleteBoard(board.id);

        navigate("/boards");
    }
}

