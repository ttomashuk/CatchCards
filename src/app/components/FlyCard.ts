import { Assets, IPointData, Sprite } from "pixi.js";
import { IEventManager } from "../services/eventManager/EventManager";
import { Settings } from "../services/GameLoader";
import GAME_EVENTS from "../services/eventManager/GameEvents";
import gsap from "gsap";

export class FlyCard extends Sprite {
    
    assets: typeof Assets
    settings: Settings;

    private sceneWidth:number;
    private sceneHeight:number;
    widthToHeight!:number;

    cardCount:number = 0;
    currentCardCode: any;

    constructor(
        private eventManager: IEventManager
    ) {
        super();
        
        this.assets = Assets;
        this.settings = this.assets.get('settings') as Settings;
        this.sceneWidth = this.settings.screenWidth;
        this.sceneHeight = this.settings.screenHeight;
        this.init()
    }
        
    init() {
        this.eventManager.addEventListener(GAME_EVENTS.ON_RESIZE_WINDOW, this.onResizeScene);
        this.eventManager.addEventListener(GAME_EVENTS.PUSH_CARD, this.pushCard);
        this.cursor = 'pointer';
    }
    
    public readonly pushCard = (cardCode:string) => {
        this.currentCardCode = cardCode;
        super.texture = this.assets.get(cardCode);
        this.visible = true;
        this.widthToHeight = this.width/this.height;
        this.anchor.set(0.5); 
        this.updateSize();
        
        let diagonal:number = Math.sqrt(this.width*this.width + this.height*this.height);
        this.x = this.sceneWidth + diagonal/2;
        this.y = this.generateRandomY();
        this.angle = 0;

        this.eventMode = 'static';
        this.on('pointerdown', this.onClick );
        this.cardCount ++;
        gsap.to(this, {     x:-diagonal/2, 
                            y: this.generateRandomY(),
                            duration:this.settings.startSpeedCardSec -this.cardCount*this.settings.speedCardDeltaSec, 
                            onComplete: () => {
                                                this.stopFlyCard();
                                                this.eventManager.dispatchEvent(GAME_EVENTS.CARD_FLY_FINISH);
                                              }
                        })
        gsap.to(this, {     
                            rotation:60, 
                            duration:this.settings.startSpeedCardSec + 1, 
                        })

        // setTimeout(()=>{
        //     this.onClick();
        // }, (Math.random()*1000) + 70)
    }

    public readonly onClick = ()=>{
        let point:IPointData = this.parent.toGlobal(this)
        this.eventManager.dispatchEvent(GAME_EVENTS.CARD_CATCHED, {cardCode:this.currentCardCode, point:point, obj:this});
        this.stopFlyCard();
    }

    stopFlyCard():void {
        gsap.killTweensOf(this);
        this.removeEventListener('pointerdown', this.onClick );
        this.visible = false;
        this.angle = 0;
    }

    generateRandomY() {
        return  Math.random()*this.sceneHeight;
    }

    public readonly onResizeScene = (param:any):void => {
        this.sceneWidth = param.width;
        this.sceneHeight = param.height;
        this.updateSize();
    }

    updateSize(){
        this.height = this.sceneHeight*this.settings.cardHightBySceneSize;
        this.width = this.height*this.widthToHeight;
    }


}