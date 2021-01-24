import Timeout = NodeJS.Timeout;

const EventEmitter = require('events');
import * as util from 'util';
const promisify = util.promisify;

export class GameEngine extends EventEmitter {

    private timer:Timeout | null;

    constructor() {
        super();
        this.timer = null;
    }

    init() {
    }

    async run() {
        this.timer = setTimeout(this.executeFrame, 1000/60);
    }

    executeFrame(){
        console.timeLog('A frame is running');
    }

    async stop(){
        if(this.timer){
            clearTimeout(this.timer)
        }
    }
}