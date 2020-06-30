import "../Helpers/helpers";

export default class BlackSheepGameEngine{
    constructor() {
        this.services = {
            inputs : {}
        };
        this.entities = [];
        this.isDebug = false;
    }
    inputs() { return this.services['inputs']; }
    addEntity(anEntity) {
        if(anEntity) {
            this.entities.push(anEntity);
        }
    }
    removeEntity(anEntity) {
        this.entities.splice(this.entities.indexOf(anEntity),1);
        var domElement = document.getElementById(anEntity.id);
        if(domElement) {
            domElement.parentNode.removeChild(domElement);
        }
        anEntity.dispose();
    }
    init() {
        document.documentElement.onkeydown = function(keyboardEventarg) {
            window.gameEngine.inputs()[keyboardEventarg.key] = true;
        };
        document.documentElement.onkeyup = function(keyboardEventarg) {
            window.gameEngine.inputs()[keyboardEventarg.key] = false;
        };
        var event = createEvent('gameInit',{});
        document.documentElement.dispatchEvent(event);
    }
    raiseEvent(eventName, eventArg) {
        for(var entityCount = 0;entityCount < this.entities.length;entityCount++) {
            this.entities[entityCount].dispatchEvent(eventName, eventArg);
        }
    }
    update() {
        var event = createEvent('gameUpdate', {});
        document.documentElement.dispatchEvent(event);
        this.raiseEvent('gameUpdate', {});
        for(let entityCount = 0; entityCount < this.entities.length;entityCount++) {
            const collider = this.entities[entityCount];
            for(let collidedCount = 0; collidedCount < this.entities.length;collidedCount++) {
                const collided = this.entities[collidedCount];
                if(collider !== collided &&
                    collider.getComponent('collision') &&
                    collided.getComponent('collision') &&
                    collider.getComponent('collision').collide(collided))
                {
                    const colliderComponent = collider.getComponent('collision');
                    const collidedComponent = collided.getComponent('collision');
                    const colliderEvent = colliderComponent.generateCollisionEventArg(collided);
                    const collidedEvent = collidedComponent.generateCollisionEventArg(collider);
                    collider.dispatchEvent('collision', colliderEvent);
                    collided.dispatchEvent('collision', collidedEvent);
                }
            }
        }
    }
    draw() {
        for(var entityCount = 0;entityCount < this.entities.length;entityCount++) {
            this.entities[entityCount].dispatchEvent('gameDraw', null);
        }
    }
    gameLoop() {
        if (window.gameEngine.inputs['x']) {
            window.gameEngine.exit();
        }
        else
        {
            window.gameEngine.gameLoopId = window.setTimeout(function(){
                window.requestAnimationFrame(window.gameEngine.gameLoop);
            },1000/120);
        }
        window.gameEngine.update();
        window.gameEngine.draw();
    }
    run() {
        this.init();
        window.requestAnimationFrame(this.gameLoop);
    }
    exit() {
        console.log("exit !");
        var event = createEvent('gameExit', {});
        document.documentElement.dispatchEvent(event);
        window.clearTimeout(this.gameLoopId);
    }
}

