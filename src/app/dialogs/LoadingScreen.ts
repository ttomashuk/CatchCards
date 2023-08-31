import { Container, Text} from "pixi.js";
import { IEventManager } from "../services/eventManager/EventManager";
import GAME_EVENTS from "../services/eventManager/GameEvents";

export class LoadingScreen extends Container {
    LOADING_TEXT:string = "Loading "
    loadingText!: Text;
    
    constructor(
        private eventManager: IEventManager,
        private parentWidth:number,
        private parentHeight:number
    ) {
        super();
        this.initScreen();
    }
    
    initScreen() {
        this.eventManager.addEventListener(GAME_EVENTS.LOAD_RESOURCES_PROGRESS, this.onLoadingProgress);
        
        this.loadingText = new Text(this.LOADING_TEXT, {
            fontSize: 40,
            align: 'center'
          })
        this.addChild(this.loadingText);
        this.loadingText.anchor.set(0.5)
        this.loadingText.x = this.parentWidth/2;
        this.loadingText.y = this.parentHeight/2;
        
    }

    public readonly onLoadingProgress = (persent:number):void => {
        this.loadingText.text = `${this.LOADING_TEXT}${persent}%`
    }
}