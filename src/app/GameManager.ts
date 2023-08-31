import { inject, injectable } from "inversify"
import { IEventManager } from "./services/eventManager/EventManager"
import GAME_EVENTS from "./services/eventManager/GameEvents"
import { IGameLoader } from "./services/GameLoader"
import { IGameServer } from "./services/server/GameServer"
import { IScene } from "./components/Scene"
import TYPES from "./models/types"
import { GetCardFromDeckResponse, NewDeckResponse } from "./services/server/ResponseTypes"

export interface IGameManager {
    createGame():void
}

@injectable()
export class GameManager implements IGameManager {

    currentDeckId:string = '';
    
    constructor(
        @inject(TYPES.GameLoader) private gameLoader: IGameLoader,
        @inject(TYPES.GameServer) private gameServer: IGameServer,
        @inject(TYPES.Scene) private scene: IScene,
        @inject(TYPES.EventManager) private eventManager: IEventManager,
    ) {
        this.eventManager.addEventListener(GAME_EVENTS.SCENE_INITED, this.startGame);
        this.eventManager.addEventListener(GAME_EVENTS.CARD_FLY_FINISH, this.pushCard);
        this.eventManager.addEventListener(GAME_EVENTS.CARD_CATCHED, this.pushCard);
        this.createGame();
    }
    
    createGame():void {
        this.gameLoader.loadResources();
        this.scene.setup();
    }
    
    public readonly  startGame = ():void => {
        this.gameServer.getNewDeck().then( (res:NewDeckResponse) => {
            this.currentDeckId = res.deck_id;
            this.pushCard();
        })
    }

    public readonly pushCard = ():void => {
        this.gameServer.getCardsFromDeck(this.currentDeckId).then( (responce:GetCardFromDeckResponse) => {
            // console.log(responce.cards[0].code);

            if(responce.remaining > 0)
                this.eventManager.dispatchEvent(GAME_EVENTS.PUSH_CARD, responce.cards[0].code);
            else {
                this.eventManager.dispatchEvent(GAME_EVENTS.SHOW_MESSAGE_DLG, "Game Over");
            }
        })
    }


 }