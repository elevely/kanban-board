import { useEffect, useState } from "react";

import "../styles/edit-column-modal.css";

interface Props {
    open: boolean;
    title: string;

    onClose: () => void;

    onSave: (
        title: string,
    ) => Promise<void>;
}

export default function EditColumnModal({
    open,
    title,
    onClose,
    onSave,
}: Props) {
    const [value, setValue] = useState(title);

    useEffect(() => {
        setValue(title);
    }, [title]);

    if (!open) return null;

    async function handleSave() {
        if (!value.trim()) return;

        await onSave(value);

        onClose();
    }

    return (
        <div className="modal-overlay">
            <div className="edit-column-modal">
                <h2>Edit Column</h2>

                <input
                    value={value}
                    onChange={(e) =>
                        setValue(e.target.value)
                    }
                    autoFocus
                />

                <div className="edit-column-actions">
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