import Timeout = NodeJS.Timeout;

const EventEmitter = require('events');
import * as util from 'util';
import {ExpressGameServer} from "./server/ExpressGameServer";
const promisify = util.promisify;

export class GameEngine extends EventEmitter {

    private timer:Timeout | null;
    private frameState: Date;

    constructor() {
        super();
        this.timer = null;
        this.frameState = new Date();
        this.init().then(() => {
            console.timeLog('Game Started');
        })
    }

    async init():Promise<void> {
        console.log('Initializing ...');
        const current = this;
        this.server = new ExpressGameServer(() => {
            console.log(`Getting Framestate ${this.frameState}`);
            return current.frameState;
        })
    }

    async run() {
        console.timeLog('Game Running');
        this.timer = setInterval(this.executeFrame.bind(this), 1000/60);
    }

    async executeFrame() {
        this.frameState = new Date();
    }

    async stop(){
        if(this.timer){
            clearTimeout(this.timer)
        }
    }
}