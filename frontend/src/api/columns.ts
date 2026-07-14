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