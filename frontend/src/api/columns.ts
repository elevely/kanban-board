import { api } from "./client";

export async function getColumns(boardId: number) {
    const response = await api.get(
        `/boards/${boardId}/columns`
    );

    return response.data;
}

export async function createColumn(
    boardId: number,
    title: string,
) {
    const response = await api.post(
        `/boards/${boardId}/columns`,
        {
            title,
        }
    );

    return response.data;
}

export async function updateColumn(
    id: number,
    title: string,
) {
    const response = await api.patch(
        `/columns/${id}`,
        {
            title,
        }
    );

    return response.data;
}

export async function deleteColumn(id: number) {
    await api.delete(`/columns/${id}`);
}