import { useEffect, useState } from "react";

import type { Card } from "../types/card";

import "../styles/edit-card-modal.css";

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
        <div className="modal-overlay">
            <div className="edit-modal">
                <h2>Edit Card</h2>

                <input
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                />

                <textarea
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    rows={6}
                />

                <div className="edit-modal-footer">
                    <button
                        className="modal-button modal-delete"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>

                    <div className="edit-modal-actions">
                        <button
                            className="modal-button modal-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            className="modal-button modal-save"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}