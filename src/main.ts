import { Container } from 'inversify';
import  TYPES  from './app/models/types'

import 'reflect-metadata'

import { GameLoader, IGameLoader } from './app/services/GameLoader'
import { IScene, Scene } from './app/components/Scene'
import { GameServer, IGameServer } from './app/services/server/GameServer';
import { GameManager, IGameManager } from './app/GameManager';
import { EventManager, IEventManager } from './app/services/eventManager/EventManager';

async function run (): Promise<void> {
    const container = new Container();
    
    container.bind<IGameManager>(TYPES.GameManager).to(GameManager).inSingletonScope();
    container.bind<IEventManager>(TYPES.EventManager).to(EventManager).inSingletonScope();
    container.bind<IGameLoader>(TYPES.GameLoader).to(GameLoader).inSingletonScope();
    container.bind<IGameServer>(TYPES.GameServer).to(GameServer).inSingletonScope();
    container.bind<IScene>(TYPES.Scene).to(Scene).inSingletonScope();
    
    container.get<GameManager>(TYPES.GameManager);
  }
  
run().catch(console.error)