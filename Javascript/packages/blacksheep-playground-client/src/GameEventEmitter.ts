export abstract class GameEventEmitter {

    handlersByEvent:{ [eventName:string] : Array<(...args:any) => Promise<void>>}

    protected constructor() {
        this.handlersByEvent = {}
    }

    on(eventName:string, handler:(...args:any)=>Promise<void>){
        if(!this.handlersByEvent.hasOwnProperty(eventName)){
            this.handlersByEvent[eventName] = [];
        }
        if(this.handlersByEvent[eventName].indexOf(handler)){
            this.handlersByEvent[eventName].push(handler);
        }
    }

    emit(eventName:string, ...args:any){
        if(Array.isArray(this.handlersByEvent[eventName])){
            for(const handler of this.handlersByEvent[eventName]){
                handler(...args).catch(() => {
                    //Do nothing if errors on behaviors
                });
            }
        }
    }
}