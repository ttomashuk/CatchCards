import { injectable } from 'inversify'
import { Card } from '../../models/Card';
import { GetCardFromDeckResponse, NewDeckResponse } from './ResponseTypes';

export interface IGameServer {
    getAllCardInDeck(): Promise<Map<string, string>>,
    getNewDeck(): Promise<NewDeckResponse>,
    getCardsFromDeck(deckId: string, amountOfCards?: number): Promise<GetCardFromDeckResponse> 
}

@injectable()
export class GameServer implements IGameServer {

    constructor() {

    }

    async getAllCardInDeck(): Promise<Map<string, string>> {
        let response:NewDeckResponse = await this.getNewDeck();
        let allCardResponse:GetCardFromDeckResponse =  await this.getCardsFromDeck(response.deck_id, 52);
        let listAllCard:Map<string, string> =  new Map(allCardResponse.cards.map((card:Card) => [card.code, card.image]));
        return listAllCard;
    }
    
    async getNewDeck(): Promise<NewDeckResponse> {
        return  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then( response => response.json())
            .then( result => {
                return result as NewDeckResponse;
            })
    }

    async getCardsFromDeck(deckId: string, amountOfCards: number = 1 ): Promise<GetCardFromDeckResponse> {
        return  fetch("https://deckofcardsapi.com/api/deck/"+deckId+"/draw/?count=" + amountOfCards)
            .then( response => response.json() )
            .then( result => {
                return result as GetCardFromDeckResponse;
            });
    }

}