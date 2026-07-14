import { useState } from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { updateCard } from "../api/cards";
import { deleteCard } from "../api/cards";

import type { Card } from "../types/card";

import EditCardModal from "./EditCardModal";

interface Props {
    card: Card;

    onUpdateCard: (
        cardId: number,
        title: string,
        description: string,
    ) => Promise<void>;
}

export default function CardView({
    card,
    onUpdateCard,
}: Props) {
    const [open, setOpen] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
    } = useDraggable({
        id: card.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    async function handleSave(
        title: string,
        description: string,
    ) {
        await updateCard(
            card.id,
            title,
            description,
        );

        await onUpdateCard(
            card.id,
            title,
            description,
        );
    }

    async function handleDelete() {
        await deleteCard(card.id);

        await onUpdateCard(
            card.id,
            card.title,
            card.description ?? "",
        );
    }

    return (
        <>
            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                onDoubleClick={() => setOpen(true)}
                style={{
                    transform: style.transform,
                    background: "#334155",
                    padding: 12,
                    borderRadius: 8,
                    marginTop: 12,
                    cursor: "grab",
                }}
            >
                <h3
                    style={{
                        margin: 0,
                    }}
                >
                    {card.title}
                </h3>

                {card.description && (
                    <p
                        style={{
                            marginTop: 8,
                        }}
                    >
                        {card.description}
                    </p>
                )}
            </div>

            <EditCardModal
                card={card}
                open={open}
                onClose={() => setOpen(false)}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </>
    );
}