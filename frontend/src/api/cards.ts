import { api } from "./client";

export async function getCards(columnId: number) {
    const response = await api.get(
        `/columns/${columnId}/cards`
    );

    return response.data;
}

export async function createCard(
    columnId: number,
    title: string,
    description: string,
) {
    const response = await api.post(
        `/columns/${columnId}/cards`,
        {
            title,
            description,
        }
    );

    return response.data;
}

export async function moveCard(
    cardId: number,
    columnId: number,
    position: number,
) {
    const response = await api.patch(
        `/cards/${cardId}/move`,
        {
            column_id: columnId,
            position,
        }
    );

    return response.data;
}