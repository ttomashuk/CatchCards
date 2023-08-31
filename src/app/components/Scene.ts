import { inject, injectable } from "inversify";
import { Application, Assets } from "pixi.js";
import { StackCards } from "./StackCards";
import { IEventManager } from "../services/eventManager/EventManager";
import { FlyCard } from "./FlyCard";
import { LoadingScreen } from "../dialogs/LoadingScreen";
import GAME_EVENTS from "../services/eventManager/GameEvents";
import TYPES from "../models/types";
import { MessageDlg } from "../dialogs/MessageDlg";
import { Settings } from "../services/GameLoader";

export interface IScene {
    setup(): void
}

@injectable()
export class Scene implements IScene {
    assets: typeof Assets
    private app!:Application<HTMLCanvasElement>;
    loadingScreen!:LoadingScreen;
    messageDlg!:MessageDlg;
    width: number = 0;
    height: number = 0;
    
    flyCard!:FlyCard;
    stackCards!:StackCards

    constructor(
        @inject(TYPES.EventManager) private eventManager: IEventManager,
    ) {
        this.eventManager.addEventListener(GAME_EVENTS.LOAD_RESOURCES_COMPLETE, this.loadResourcesComplete)
        this.eventManager.addEventListener(GAME_EVENTS.SHOW_MESSAGE_DLG, this.showMessageDlg)
        this.assets = Assets
    }
    
    setup(): void {
        this.setupCanvas();
        this.showLoadingScreen();
    }

    setupCanvas() {
        this.app = new Application({
            backgroundColor: 0x308834,
            resizeTo: document.body,
          })
        document.body.appendChild(this.app.view);
        
        window.addEventListener('resize', this.onResizeWindow) 
        this.app.resize();
        this.onResizeWindow();
    }
    
    public readonly showMessageDlg = (message:string):void => {
        this.messageDlg = new MessageDlg(this.eventManager);
        this.messageDlg.showDlg(message)
        this.app.stage.addChild(this.messageDlg);
    }

    public readonly onResizeWindow = ():void => {
        this.app.resize();
        let canvas = document.body.getElementsByTagName("canvas")[0];
        this.width = canvas.clientWidth;
        this.height = canvas.clientHeight;
        if(this.assets.get('settings')) {
            (this.assets.get('settings') as Settings).screenWidth = this.width;
            (this.assets.get('settings') as Settings).screenHeight = this.height;
        }
        this.updateChildrenPosition();
        this.eventManager.dispatchEvent(GAME_EVENTS.ON_RESIZE_WINDOW, {width:canvas.clientWidth, height:canvas.clientHeight})
    }
    
    showLoadingScreen() {
        this.loadingScreen = new LoadingScreen(this.eventManager, this.width, this.height );
        this.app.stage.addChild(this.loadingScreen);
    }
    
    public readonly loadResourcesComplete = ():void => {
        console.log(`Scene::loadResourcesComplete`);
        (this.assets.get('settings') as Settings).screenWidth = this.width;
        (this.assets.get('settings') as Settings).screenHeight = this.height;
        this.setupLayout();
        this.app.stage.removeChild(this.loadingScreen);
    }

    setupLayout() {
        this.stackCards = new StackCards(this.eventManager);
        this.stackCards.y = this.height;
        this.app.stage.addChild(this.stackCards);
        
        this.flyCard = new FlyCard(this.eventManager);
        this.app.stage.addChild(this.flyCard);
        
        this.eventManager.dispatchEvent(GAME_EVENTS.SCENE_INITED);
    }

    updateChildrenPosition() {
        if(this.stackCards){
            this.stackCards.y = this.height;
        }
    }

    

}