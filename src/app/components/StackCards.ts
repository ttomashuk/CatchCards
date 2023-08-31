import { Assets, Container, IPointData, Sprite } from "pixi.js";
import { IEventManager } from "../services/eventManager/EventManager";
import { FunCards } from "./FunCards";
import GAME_EVENTS from "../services/eventManager/GameEvents";
import { Settings } from "../services/GameLoader";

export class StackCards extends Container {
    assets: typeof Assets
    settings: Settings;
    
    funs: Array<FunCards> = new Array<FunCards>()
    cardsList: Array<string> = new Array<string>()
    private sceneWidth:number;
    
    constructor(
        private eventManager: IEventManager,
    ) {
        super();
        this.eventManager.addEventListener(GAME_EVENTS.CARD_CATCHED, this.onCardCathed)
        this.eventManager.addEventListener(GAME_EVENTS.ON_RESIZE_WINDOW, this.onResizeWindow)

        this.assets = Assets;
        this.settings = this.assets.get('settings') as Settings;
        this.sceneWidth = this.settings.screenWidth;
        this.initFan();
    }

    initFan() {
        this.createNewFan();
    }
    
    public readonly onCardCathed = (data:{cardCode:string, point:IPointData, obj:Sprite}):void => {
        let lastFun:FunCards = this.funs[this.funs.length-1];
        if(! lastFun.isCanAddCard()) {
            this.createNewFan();
            lastFun = this.funs[this.funs.length-1];
        }

        lastFun.addCard(data.cardCode, this.toLocal(data.point), this.updateFunPositions);
    }

    createNewFan() {
        let fun:FunCards = new FunCards();
        this.funs.push(fun);
        this.addChild(fun);
        this.updateFunPositions();
    }

    public readonly onResizeWindow = (data:{width:number, height:number}) => {
        this.sceneWidth = data.width;
        this.funs.forEach( fun => fun.onResizeWindow(data))
        this.updateFunPositions();
    }

    public readonly updateFunPositions = () => {
        let totalAllFunsWidth:number = 0;
        let deltaStep:number = 0;
        this.funs.forEach( fun => totalAllFunsWidth += fun.width)
        totalAllFunsWidth +=  this.sceneWidth * this.settings.distanceBetweenFuns * (this.funs.length-1);

        if(totalAllFunsWidth > this.sceneWidth) {
            deltaStep = (this.sceneWidth - totalAllFunsWidth) / (this.funs.length-1);
            totalAllFunsWidth = this.sceneWidth;
        }
        
        if(this.funs.length <= 1) {
            this.funs[0].x = this.sceneWidth/2;
            this.funs[0].y = -(this.funs[0].getLocalBounds().height + this.funs[0].getLocalBounds().y);
        } else {

            for(let i=1; i < this.funs.length; i++) {
                this.funs[0].x = this.sceneWidth/2 - (totalAllFunsWidth/2 - this.funs[0].width/2);
                this.funs[i].x =      this.funs[i-1].x 
                                    + this.funs[i-1].width/2 
                                    + this.sceneWidth*this.settings.distanceBetweenFuns 
                                    + deltaStep
                                    + this.funs[i].width/2 ;
            }
    
            this.funs.forEach(fun => {
                fun.y = -(fun.getLocalBounds().height + fun.getLocalBounds().y)
            })
        }
    }

}    