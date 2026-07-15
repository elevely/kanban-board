import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

import type { BoardColumn } from "../types/boardColumn";

import CardView from "./CardView";

import "../styles/column.css";

interface Props {
    column: BoardColumn;
    onCreateCard: (
        columnId: number,
        title: string,
    ) => Promise<void>;

    onUpdateCard: (
        cardId: number,
        title: string,
        description: string,
    ) => Promise<void>;
}

export default function ColumnView({
    column,
    onCreateCard,
    onUpdateCard,
}: Props) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    const [title, setTitle] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    async function handleCreateCard() {
        if (!title.trim()) return;

        await onCreateCard(column.id, title);

        setTitle("");
        setIsCreating(false);
    }

    return (
        <div
            ref={setNodeRef}
            className="column"
        >
            <div className="column-header">
                <h2 className="column-title">
                    {column.title}
                </h2>

                <div className="column-count">
                    {column.cards.length}
                </div>
            </div>

            {column.cards.map((card) => (
                <CardView
                    key={card.id}
                    card={card}
                    onUpdateCard={onUpdateCard}
                />
            ))}

            {isCreating ? (
                <div className="column-create">
                    <input
                        placeholder="Card title"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        autoFocus
                    />

                    <div className="column-create-actions">
                        <button
                            onClick={handleCreateCard}
                        >
                            Create
                        </button>

                        <button
                            className="cancel-button"
                            onClick={() => {
                                setIsCreating(false);
                                setTitle("");
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className="new-card-button"
                    onClick={() => setIsCreating(true)}
                >
                    + New Card
                </button>
            )}
        </div>
    );
}