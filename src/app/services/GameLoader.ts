import { inject, injectable } from 'inversify'
import { Assets} from 'pixi.js'
import { IEventManager } from './eventManager/EventManager';
import GAME_EVENTS from './eventManager/GameEvents';
import { IGameServer } from './server/GameServer';
import TYPES from "../models/types";

export interface Settings {
    "cardHightBySceneSize": number,
    "startSpeedCardSec": number,
    "speedCardDeltaSec": number,
    fun: FunSettings,
    "distanceBetweenFuns":number,
    "screenWidth": number,
    "screenHeight": number
}

export interface FunSettings {
  minAngleBetweenCards:number;
  maxAngleBetweenCards:number;
  maxAngle: number;
  fanCardsRadius: number;  
}

export interface IGameLoader {
  loadResources (): Promise<void>
} 

@injectable()
export class GameLoader implements IGameLoader {
  
  loader: typeof Assets
  settings!: Settings
  
  constructor (
    @inject(TYPES.GameServer) private gameServer: IGameServer,
    @inject(TYPES.EventManager) private eventManager: IEventManager,
  ) {
    this.loader = Assets;
  }

  async loadResources (): Promise<void> {
    let cardList: Map<string, string> =  await this.gameServer.getAllCardInDeck();
    this.loader.add('settings', 'assets/settings.json');
    cardList.forEach((image, code) => {
      this.loader.add(code, image);
    })

    this.loader.load([ ...cardList.keys(), 'settings' ], (persent:number)=>{
      this.eventManager.dispatchEvent(GAME_EVENTS.LOAD_RESOURCES_PROGRESS, Math.round(persent*100));
    }).then(() => {
      this.eventManager.dispatchEvent(GAME_EVENTS.LOAD_RESOURCES_COMPLETE);
    });
  }

}