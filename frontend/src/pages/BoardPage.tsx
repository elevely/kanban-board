import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    DndContext,
    type DragEndEvent,
} from "@dnd-kit/core";

import { getColumns, createColumn } from "../api/columns";
import { moveCard } from "../api/cards";
import { getCards } from "../api/cards";
import { createCard } from "../api/cards";

import type { BoardColumn } from "../types/boardColumn";

import ColumnView from "../components/ColumnView";

import "../styles/board-page.css";
import Header from "../components/layout/Header";

export default function BoardPage() {
    const { id } = useParams();

    const [columns, setColumns] = useState<BoardColumn[]>([]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (!id) return;

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
                        <h1 className="board-page-title">
                            Board #{id}
                        </h1>

                        <p className="board-page-subtitle">
                            Manage your workflow.
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
                            />
                        ))}
                    </div>
                </DndContext>
            </div>
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

}

