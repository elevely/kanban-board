import { useEffect, useState } from "react";

import type { Card } from "../types/card";

interface Props {
    card: Card;
    open: boolean;
    onClose: () => void;

    onSave: (
        title: string,
        description: string,
    ) => Promise<void>;

    onDelete: () => Promise<void>;
}

export default function EditCardModal({
    card,
    open,
    onClose,
    onSave,
    onDelete,
}: Props) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(
        card.description ?? ""
    );

    useEffect(() => {
        setTitle(card.title);
        setDescription(card.description ?? "");
    }, [card]);

    if (!open) return null;

    async function handleSave() {
        await onSave(title, description);
        onClose();
    }

    async function handleDelete() {
        await onDelete();
        onClose();
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
            }}
        >
            <div
                style={{
                    width: 500,
                    background: "#1e293b",
                    borderRadius: 12,
                    padding: 24,
                    color: "white",
                }}
            >
                <h2>Edit Card</h2>

                <input
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: 10,
                        marginTop: 20,
                        marginBottom: 15,
                    }}
                />

                <textarea
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    rows={6}
                    style={{
                        width: "100%",
                        padding: 10,
                        resize: "vertical",
                    }}
                />

                <button
                    onClick={handleDelete}
                    style={{
                        marginRight: "auto",
                        background: "#dc2626",
                        color: "white",
                    }}
                >
                    Delete
                </button>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10,
                        marginTop: 20,
                    }}
                >
                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}