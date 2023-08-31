import { Card } from "../../models/Card";

export type NewDeckResponse = { 
    deck_id: string; 
    shuffled: boolean; 
    success: boolean; 
    remaining: number; 
}

export type GetCardFromDeckResponse = { 
    deck_id: string; 
    success: boolean;
    cards: Card[]; 
    remaining: number; 
}