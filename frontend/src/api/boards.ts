import { api } from "./client";

export async function getBoards() {
    const response = await api.get("/boards");
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