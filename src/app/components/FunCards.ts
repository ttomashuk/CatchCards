import gsap from "gsap";
import { Assets, Container, IPointData, Sprite } from "pixi.js";
import { Settings } from "../services/GameLoader";

export class FunCards extends Container {

    assets: typeof Assets
    settings: Settings;
    private sceneHeight:number; 


    private cardWidth: number = 0;
    private cardHeight: number = 0;

    cardsSprite: Array<Sprite> = new Array<Sprite>()
    cardsList: Array<string> = new Array<string>()
    
    constructor(
    ) {
        super();
        this.assets = Assets;
        this.settings = this.assets.get('settings') as Settings;
        this.sceneHeight = this.settings.screenHeight;

    }

    onResizeWindow(data:{width:number, height:number}) {
        this.sceneHeight = data.height;
        if(this.cardsList.length > 0)
            this.calculateCardSize(this.cardsList[0]);
        this.drawFun();
    }

    private drawFun() {
        let angle = this.settings.fun.maxAngle/this.cardsSprite.length;
        if(angle > this.settings.fun.maxAngleBetweenCards) 
            angle = this.settings.fun.maxAngleBetweenCards;
        if(angle < this.settings.fun.minAngleBetweenCards) 
            angle = this.settings.fun.minAngleBetweenCards;

        let startAngle = angle*(this.cardsSprite.length-1)/2;
        for (let i = 0; i < this.cardsSprite.length; i++) {
            this.cardsSprite[i].width = this.cardWidth;
            this.cardsSprite[i].height = this.cardHeight;
            this.cardsSprite[i].angle = i*angle-startAngle;
            
            this.cardsSprite[i].x = 0;
            this.cardsSprite[i].y = 0;
        }
    }

    addCard(cardCode:string, point:IPointData, onCardAddAnimEnd:Function) {
        this.calculateCardSize(cardCode);
        this.cardsList.push(cardCode);
        let card = new Sprite(this.assets.get(cardCode));
        card.width = this.cardWidth;
        card.height = this.cardHeight;
        card.anchor.set(0.5, this.settings.fun.fanCardsRadius);
        this.cardsSprite.push(card);
        
        let startPoint:IPointData = this.toLocal(point, this.parent);
        card.x = startPoint.x
        card.y = startPoint.y + (card.height*this.settings.fun.fanCardsRadius - card.height*0.5 ) ;
        
        this.addChild(card);

        setTimeout(()=> {
            let endPoint:IPointData = {x: 0, y:-(card.height - card.height*this.settings.fun.fanCardsRadius)}
            gsap
                .fromTo(card,{x:card.x, y:card.y,  }, { x:endPoint.x, 
                                                        y:endPoint.y,    
                                                        duration:0.2,
                                                        onComplete: () => {
                                                            this.drawFun();
                                                            onCardAddAnimEnd();
                                                          }
                })
        }, 0);

    }

    isCanAddCard():boolean {
        if( this.settings.fun.minAngleBetweenCards < this.settings.fun.maxAngle/this.cardsSprite.length )
            return true;
        return false;
    }

    calculateCardSize(cardCode:string) {
        let card = this.assets.get(cardCode);
        let cardWidthToHeight:number = card.width/card.height;
        this.cardHeight = this.sceneHeight * this.settings.cardHightBySceneSize;
        this.cardWidth = this.cardHeight * cardWidthToHeight;
    }


}