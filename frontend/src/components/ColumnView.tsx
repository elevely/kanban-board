import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

import type { BoardColumn } from "../types/boardColumn";

import CardView from "./CardView";

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

    async function handleCreateCard() {
        if (!title.trim()) return;

        await onCreateCard(column.id, title);

        setTitle("");
    }

    return (
        <div
            ref={setNodeRef}
            style={{
                background: "#1e293b",
                borderRadius: 12,
                padding: 20,
                minWidth: 300,
            }}
        >
            <h2
                style={{
                    marginTop: 0,
                    marginBottom: 20,
                }}
            >
                {column.title}
            </h2>

            <div
                style={{
                    marginBottom: 20,
                }}
            >
                <input
                    placeholder="Card title"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: 8,
                        marginBottom: 8,
                    }}
                />

                <button
                    onClick={handleCreateCard}
                    style={{
                        width: "100%",
                        padding: 8,
                    }}
                >
                    Add Card
                </button>
            </div>

            {column.cards.length === 0 && (
                <div
                    style={{
                        color: "#94a3b8",
                        fontSize: 14,
                        marginBottom: 10,
                    }}
                >
                    Drop cards here
                </div>
            )}

            {column.cards.map((card) => (
                <CardView
                    key={card.id}
                    card={card}
                    onUpdateCard={onUpdateCard}
                />
            ))}
        </div>
    );
}