import { api } from "./client";

export async function getBoards() {
    const response = await api.get("/boards");
    return response.data;
}

export async function getBoard(id: number) {
    const response = await api.get(`/boards/${id}`);
    return response.data;
}

export async function createBoard(
    title: string,
    description: string,
) {
    const response = await api.post("/boards", {
        title,
        description,
    });

    return response.data;
}

export async function updateBoard(
    id: number,
    title: string,
    description: string,
) {
    const response = await api.patch(`/boards/${id}`, {
        title,
        description,
    });

    return response.data;
}

export async function deleteBoard(id: number) {
    await api.delete(`/boards/${id}`);
}