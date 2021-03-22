import Timeout = NodeJS.Timeout;

const EventEmitter = require('events');
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import {ExpressGameServer} from "./server/ExpressGameServer";
import {Scene} from "./Scene";
const promisify = util.promisify;

export class GameEngine extends EventEmitter {

    private timer:Timeout | null;
    private frameState: Date;
    private server?: ExpressGameServer;
    private scenes:Scene[];

    constructor() {
        super();
        this.timer = null;
        this.frameState = new Date();
        this.scenes = [];
    }

    async init():Promise<void> {
        //Load all available scenes from files
        const loadScenePromise = new Promise<void>((resolve, reject) => {
            fs.readdir('scenes', (async (err, files) => {
                for(let sceneIndex = 0;sceneIndex < files.length; sceneIndex++){
                    let sceneFile = files[sceneIndex];
                    if(sceneFile){
                        const readFilePromise = new Promise((fileReadHandler) => {
                            fs.readFile(`scenes/${sceneFile}`,{
                                encoding:'utf8'
                            }, (fileErr, data) => {
                                if(!fileErr){
                                    this.scenes.push(Scene.deserialize(data));
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
        //TODO use a factory to create the right server with the
        this.server = new ExpressGameServer(() => {
            console.log(`Getting Framestate ${this.frameState}`);
            return current.frameState;
        })
    }

    async run() {
        await this.init()

        //TODO : Do the game cycle
        this.timer = setInterval(this.executeFrame.bind(this), 1000/60);
    }

    async executeFrame() {
        this.frameState = new Date();
    }

    async stop(){
        if(this.timer){
            clearTimeout(this.timer)
        }
        if(this.server){
            await this.server.stop();
        }
    }

    async getScene(sceneIndex:number):Promise<Scene> {
        if(sceneIndex >= 0 && sceneIndex < this.scenes.length){
            return this.scenes[0]
        }
        throw new Error(`No scene with index ${sceneIndex}.`);
    }

}