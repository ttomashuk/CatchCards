export interface ICard {
    code: string;
    image: string;
    value:string;
    suit: string;
}

export class Card implements ICard {
    
    public code: string = '';
    public image: string = '';
    public value:string = '';
    public suit: string = '';
}