export class EventArgConverter {

    converters:{ [eventName:string] : (eventArg:any) => { [prop:string] : any } }

    constructor() {
        this.converters = {}
        this.addOrReplaceConverter('keyup', (e:KeyboardEvent) => {
            return {
                key: e.key,
                withCtrl: e.ctrlKey,
                withAlt: e.altKey,
                withMaj: e.shiftKey
            }
        })
    }

    addOrReplaceConverter(eventName:string, handler: (eventArg:any) => { [prop:string] : any }):void {
        this.converters[eventName] = handler;
    }

    convert(eventName:string, eventArg:any):any{
        if(this.converters.hasOwnProperty(eventName)){
            const arg:any = this.converters[eventName](eventArg);
            arg.eventName = eventName;
            return arg;
        }
        return eventArg;
    }
}

export const eventArgConverter:EventArgConverter = new EventArgConverter();