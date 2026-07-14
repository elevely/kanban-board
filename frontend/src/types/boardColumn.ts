import type { Column } from "./column";
import type { Card } from "./card";

export interface BoardColumn extends Column {
    cards: Card[];
}