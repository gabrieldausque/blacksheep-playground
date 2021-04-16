import {Behavior, BehaviorContract} from "./Behavior";
import {Entity} from "../Entity";
import {ScriptBehavior} from "./ScriptBehavior";
import Timer = NodeJS.Timer;
import Timeout = NodeJS.Timeout;

export class TimerBehavior extends Behavior {

    public static metadata = [
        {
            contractType:'Behavior',
            contractName:'Timer',
            isShared:false,
        }
    ]

    constructor() {
        super(TimerBehavior.metadata[0]);
        this.triggerAfter = 0;
        this.scriptToExecute = [];
    }

    timer? : Timeout;
    triggerAfter: number;
    scriptToExecute: string[];

    async execute(owner: Entity): Promise<void> {
        if(!this.timer){
            this.timer = setTimeout(async () => {
                if(typeof this[`on_timer`] === 'function'){
                    await this[`on_timer`](owner);
                }
            }, this.triggerAfter)
        }
    }

    initAfterDeserialize() {
        const functionBody = this.scriptToExecute.join(' ');
        this[`on_timer`] = eval(functionBody);
    }

    serialize(): BehaviorContract {
        return {
            contractType: TimerBehavior.metadata[0].contractType,
            contractName: TimerBehavior.metadata[0].contractName,
            reactOn: this.reactOn,
            triggerAfter: this.triggerAfter
        }
    }
}