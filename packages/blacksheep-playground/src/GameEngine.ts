const EventEmitter = require('events');
import * as util from 'util';
const promisify = util.promisify;

export class GameEngine extends EventEmitter {

    private timer;

    constructor() {
        super();
    }

    init() {

    }

    async run() {
        this.timer = setTimeout(this.executeFrame, 1000/60);
    }

    executeFrame(){
        console.timeLog('A frame is running')
    }
}