import { useEffect, useState } from "react";

import type { Board } from "../types/board";

import "../styles/edit-board-modal.css";

interface Props {
    board: Board | null;
    open: boolean;

    onClose: () => void;

    onSave: (
        title: string,
        description: string,
    ) => Promise<void>;
}

export default function EditBoardModal({
    board,
    open,
    onClose,
    onSave,
}: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (!board) return;

        setTitle(board.title);
        setDescription(board.description ?? "");
    }, [board]);

    if (!open || !board) return null;

    async function handleSave() {
        await onSave(
            title,
            description,
        );

        onClose();
    }

    return (
        <div className="modal-overlay">
            <div className="edit-modal">
                <h2>Edit Board</h2>

                <input
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    placeholder="Board title"
                />

                <textarea
                    rows={5}
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    placeholder="Description"
                />

                <div className="edit-modal-footer">
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
    );
}