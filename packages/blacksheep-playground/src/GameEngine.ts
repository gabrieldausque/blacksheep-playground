import Timeout = NodeJS.Timeout;

const EventEmitter = require('events');
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import {ExpressGameServer} from "./server/ExpressGameServer";
import {Scene} from "./Scene";
const promisify = util.promisify;
import {v4 as guid} from 'uuid';

export class GameEngine extends EventEmitter {

    private timer:Timeout | null;
    private frameState: Date;
    private server?: ExpressGameServer;
    private readonly scenes:Scene[];
    id:string;
    private currentScene?: Scene;
    private players:string[];

    constructor() {
        super();
        this.timer = null;
        this.frameState = new Date();
        this.scenes = [];
        this.id = guid();
        this.players = [];
    }

    async init():Promise<void> {
        await ExpressGameServer.initApplication();
        this.server = new ExpressGameServer(this.id,() => {
            //TODO : get the active scene
            return current.frameState;
        })
        this.server.on('Client.Update', () => {
            //TODO : Push new state from client to update queue, to be applied to correct entity
        })
        this.server.on('Join', (playerId:string) => {
            console.log(`A player as join the game ${this.id}`);
            this.players.push(playerId);
            this.server?.sendToPlayer(playerId,'Joined', this.currentScene?.serialize())
        })
        this.server.on('EventRaised', (arg) => {
            this.currentScene?.emit('EventRaised',arg);
        })

        const loadScenePromise = new Promise<void>((resolve, reject) => {
            fs.readdir( `${process.cwd()}/scenes`, (async (err, files) => {
                for(let sceneIndex = 0;sceneIndex < files.length; sceneIndex++){
                    let sceneFile = files[sceneIndex];
                    if(sceneFile){
                        const readFilePromise = new Promise((fileReadHandler) => {
                            fs.readFile(`scenes/${sceneFile}`,{
                                encoding:'utf8'
                            }, (fileErr, data) => {
                                if(!fileErr){
                                    this.addScene(Scene.deserialize(data));
                                    fileReadHandler(undefined);
                                }
                            });
                        })
                        await readFilePromise;
                    }
                }
                resolve(undefined);
            }))
        })
        await loadScenePromise;
        const current = this;
        this.scenes.sort((s1:Scene, s2:Scene) => {
            if(s1.order > s2.order)
                return 1;
            if(s1.order < s2.order)
                return -1;
            return 0;
        })
        this.currentScene = this.scenes[0];
    }

    getCurrentScene():string | undefined {
        return this.currentScene? JSON.stringify(this.currentScene.serialize()): undefined;
    }

    async run() {
        await this.init()
        //TODO : Do the game cycle
        this.timer = setInterval(this.update.bind(this), 1000/60);
    }

    async update() {
        this.frameState = new Date();
        if(this.server && this.currentScene){
            await this.currentScene.update();
            //TODO : send update to client
            await this.server.sendUpdate({
                gameId:this.id,
                frameState:this.frameState,
                scene:this.currentScene?.serialize()
            });
        }
    }

    async stop(){
        if(this.timer){
            clearTimeout(this.timer)
        }
        if(this.server){
            await this.server.stop();
        }
    }

    async getScene(sceneIndex:number):Promise<Scene | undefined> {
        if(sceneIndex >= 0 && sceneIndex < this.scenes.length){
            return this.scenes[sceneIndex]
        }
        return;
    }

    addScene(scene: Scene) {
        if(!this.scenes.find(s => s.key === scene.key))
        {
            this.scenes.push(scene);
            scene.on('NextScene',async () => {
                console.log('next scene');
                let sceneIndex = this.currentScene ?
                    this.scenes.indexOf(this.currentScene) + 1 :
                    0;
                if(sceneIndex >= this.scenes.length ){
                    sceneIndex = 0
                }
                const newScene = await this.getScene(sceneIndex);
                if(newScene){
                    this.currentScene = newScene;
                    //TODO : add player entity from previous scene
                    await this.server?.send('NewScene',this.currentScene);
                }
            })
        }
    }
}