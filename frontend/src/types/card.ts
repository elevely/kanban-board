export interface Card {
    id: number;
    title: string;
    description: string | null;
    position: number;
    column_id: number;
}