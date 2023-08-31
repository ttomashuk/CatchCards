import { injectable } from 'inversify';
import GAME_EVENTS from './GameEvents';

export interface IEventManager {
    addEventListener(event:GAME_EVENTS, handler:Function):void
    dispatchEvent(event:GAME_EVENTS, data?:any):void;
    removeEventListener(event:GAME_EVENTS, handler:any):void;
}

@injectable()
export class EventManager implements IEventManager {

    subscribers:Map<GAME_EVENTS, Set<Function>> = new Map();
  
    constructor() {
    }
    
    addEventListener(event:GAME_EVENTS, handler:Function) {
        if(!this.subscribers.has(event))
               this.subscribers.set(event, new Set<Function>());
        (this.subscribers.get(event) as Set<Function>).add(handler)
    }

    dispatchEvent(event:GAME_EVENTS, data?:any){
        if(this.subscribers.has(event)) {
            let handlers:Set<Function> = this.subscribers.get(event) as Set<Function>
            handlers.forEach(func => {
                func(data);
            })
        }
    }

    removeEventListener(event:GAME_EVENTS, handler:any) {
        if(this.subscribers.has(event)) {
            (this.subscribers.get(event) as Set<Function>).delete(handler);
        }
    }
}