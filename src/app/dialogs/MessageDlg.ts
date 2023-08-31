import { Assets, Container, Text} from "pixi.js";
import { IEventManager } from "../services/eventManager/EventManager";
import GAME_EVENTS from "../services/eventManager/GameEvents";
import { Settings } from "../services/GameLoader";

export class MessageDlg extends Container {
    assets: typeof Assets;
    settings: Settings;

    private screenWidth!:number;
    private screenHeight!:number; 
    
    message:string = "";
    messageText!: Text;
    
    constructor(
        private eventManager: IEventManager
    ) {
        super();
        this.assets = Assets;
        this.settings = this.assets.get('settings') as Settings;
        this.screenWidth = this.settings.screenWidth;
        this.screenHeight = this.settings.screenHeight;
        this.init();
    }

    init() {
        this.eventManager.addEventListener(GAME_EVENTS.ON_RESIZE_WINDOW, this.onResizeWindow);
    }
    
    showDlg(message:string):void {
        this.message = message;

        this.messageText = new Text(this.message, {
            fontSize: 40,
            align: 'center'
          })
        this.addChild(this.messageText);
        this.messageText.anchor.set(0.5)
        this.setupPositionDlg();
    }
    
    setupPositionDlg() {
        this.messageText.x = this.screenWidth/2;
        this.messageText.y = this.screenHeight/2;
    }

    public readonly onResizeWindow = (param:any):void => {
        this.screenWidth = param.width;
        this.screenHeight = param.height;
        this.setupPositionDlg();
    }

}