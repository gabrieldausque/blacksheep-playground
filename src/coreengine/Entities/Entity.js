let globalEntityId = 0;

export default class Entity {
    constructor() {
        this.id = globalEntityId;
        globalEntityId++;
        this.events = {
            gameUpdate : [],
            gameDraw : []
        };
        this.components = {};
        this.behaviors = {};
    }
    addEventListener(eventName, eventHandler) {
      if(this.events[eventName] === undefined) {
          this.events[eventName] = [];
      }
      this.events[eventName].push(eventHandler);
    };
    removeEventListener(eventName, eventHandler) {
        if(this.events[eventName] === undefined) {
            this.events[eventName] = [];
        }
        this.events[eventName].splice(this.events[eventName].indexOf(eventHandler),1);
    };
    dispatchEvent(eventName,eventArg) {
        if(this.events[eventName] !== undefined) {
            var handlers = this.events[eventName];
            for(var handlerCount=0;handlerCount < handlers.length;handlerCount++)
            {
                if(handlers[handlerCount] !== undefined) {
                    handlers[handlerCount].call(this, eventArg);
                }
            }
        }
    }
    addBehavior(aBehavior) {
        this.behaviors[aBehavior.name] = aBehavior;
    }
    getBehavior(behaviorName) {
        return this.behaviors[behaviorName];
    }
    addComponent(aComponent) {
        this.components[aComponent.name] = aComponent;
    }
    getComponent(componentName) {
        return this.components[componentName];
    }
    dispose() {
        this.events = undefined;
        this.components = undefined;
        for(let b in this.behaviors) {
            b.entity = undefined;
        }
        this.behaviors = undefined;
    }
}


