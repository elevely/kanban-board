import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

import type { BoardColumn } from "../types/boardColumn";

import CardView from "./CardView";

import EditColumnModal from "./EditColumnModal";

import "../styles/column.css";

interface Props {
    canEdit: boolean;
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

    onRenameColumn: (
        columnId: number,
        title: string,
    ) => Promise<void>;

    onDeleteColumn: (
        columnId: number,
    ) => Promise<void>;
}

export default function ColumnView({
    canEdit,
    column,
    onCreateCard,
    onUpdateCard,
    onRenameColumn,
    onDeleteColumn,
}: Props) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    const [title, setTitle] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

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
            <div>
                <h2 className="column-title">
                    {column.title}
                </h2>
            </div>

            <div className="column-actions">
                <div className="column-count">
                    {column.cards.length}
                </div>

                {canEdit && (
                    <>
                        <button
                            className="column-action"
                            onClick={() => setIsEditOpen(true)}
                        >
                            Edit
                        </button>

                        <button
                            className="column-action delete"
                            onClick={async () => {
                                const confirmed = window.confirm(
                                    "Delete this column?\n\nAll cards in this column will also be deleted."
                                );

                                if (!confirmed) return;

                                await onDeleteColumn(column.id);
                            }}
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>

            {column.cards.map((card) => (
                <CardView
                    key={card.id}
                    card={card}
                    canEdit={canEdit}
                    onUpdateCard={onUpdateCard}
                />
            ))}

            {canEdit && (
                <>
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
                </>
            )}

            {canEdit && (
                <EditColumnModal
                    open={isEditOpen}
                    title={column.title}
                    onClose={() => setIsEditOpen(false)}
                    onSave={async (title) => {
                        await onRenameColumn(
                            column.id,
                            title,
                        );

                        setIsEditOpen(false);
                    }}
                />
            )}

        </div>
    );
}