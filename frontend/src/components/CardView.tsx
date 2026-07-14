import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import type { Card } from "../types/card";

interface Props {
    card: Card;
}

export default function CardView({ card }: Props) {
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

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
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
    );
}