import "../Helpers/helpers";

class BlackSheepGameEngine{
    constructor() {
        this.services = {
            inputs : {}
        };
        this.entities = [];
        this.isDebug = false;
    }
    inputs() { return this.services['inputs']; }
    addEntity(anEntity) {
        this.entities.push(anEntity);
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
    //TODO : move to a specific class
    isCollidedWith(entity) {
        if((entity === this) ||
            (typeof this.components['collision']) === 'undefined' ||
            (typeof entity.components['collision'] === 'undefined')
        )
            return false;
        else
        {
            var myCollision = this.components['collision'];
            var itsCollision = entity.components['collision'];
            return myCollision.collisionRectangle.Intersect(itsCollision.collisionRectangle);
        }
    }
    update() {
        var event = createEvent('gameUpdate', {});
        document.documentElement.dispatchEvent(event);
        for(var entityCount = 0;entityCount < window.gameEngine.entities.length;entityCount++) {
             window.gameEngine.entities[entityCount].dispatchEvent('gameUpdate', {});
        }
        for(var entityCount = 0; entityCount < window.gameEngine.entities.length;entityCount++) {
            var collider = window.gameEngine.entities[entityCount];
            for(var collidedCount = 0; collidedCount < window.gameEngine.entities.length;collidedCount++) {
                var collided = window.gameEngine.entities[collidedCount];
                if(!(collider === collided) &&
                    collider.components['collision'] &&
                    collider.components['collision'].collisionRectangle.intersect(
                    { x : collider.components['body'].x, y : collider.components['body'].y },
                    collided.components['collision'].collisionRectangle,
                    { x : collided.components['body'].x, y : collided.components['body'].y }))
                {
                    collider.dispatchEvent('collision', { collided : collided});
                    collided.dispatchEvent('collision', { collided : collider});
                }
            }
        }
    };
    draw() {
        for(var entityCount = 0;entityCount < window.gameEngine.entities.length;entityCount++) {
            window.gameEngine.entities[entityCount].dispatchEvent('gameDraw', null);
        }
    };
    gameLoop() {
            if (window.gameEngine.inputs['x']) {
                window.gameEngine.exit();
            }
            else
            {
                window.setTimeout(function(){
                    window.requestAnimationFrame(window.gameEngine.gameLoop)
                },1000/60)
            }
            window.gameEngine.update();
            window.gameEngine.draw();
    }
    run() {
        this.init();
        window.requestAnimationFrame(window.gameEngine.gameLoop)
    };
    exit() {
        console.log("exit !");
        var event = createEvent('gameExit', {});
        document.documentElement.dispatchEvent(event);
        window.clearInterval(window.gameEngine.gameLoopId);
    }
}

