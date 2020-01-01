import * as BlackSheepGameEngine from './blacksheepgameengine-build.js';

class GroundTile extends BlackSheepGameEngine.Entity {
    constructor(x, y, color) {
        super();
        this.addComponent(new BlackSheepGameEngine.BodyComponent(x,y,0,64,64,0));
        this.addComponent(new BlackSheepGameEngine.CSSImageComponent(color));
        this.addComponent(new BlackSheepGameEngine.CollisionComponent(new BlackSheepGameEngine.Rectangle(0,0,64,64)));

        this.addBehavior(new BlackSheepGameEngine.DrawCSSBehavior(this));
    }
}

class MoveOnKeyPressedBehavior extends BlackSheepGameEngine.Behavior {
    constructor(entity, leftKey, rightKey, upKey, downKey) {
        super('moveOnKeyPress', entity);
        this.inputService = window.gameEngine.inputs();
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.upKey = upKey;
        this.downKey = downKey;
    }
    update(eventArgs) {
        let move = { 
            x:0,
            y:0
        };
        const currentEntity = eventArgs.currentEntity;
        const moveOnKeyPressBehavior = currentEntity.getBehavior('moveOnKeyPress');
        const moveComponent = currentEntity.getComponent('move');
        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.leftKey]) {
            move.x = -10;
        }
        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.rightKey]) {
            move.x = 10;
        }
        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.upKey]) {
            move.y = -10;
        }
        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.downKey]) {
            move.y = 10;
        }
        moveComponent.speedx = move.x;
        moveComponent.speedy = move.y;
        currentEntity.dispatchEvent('speedUpdated',move); 
    }
}

class DebugBehavior extends BlackSheepGameEngine.Behavior {
    constructor(entity) {
        super('debugger', entity);
        entity.addEventListener('move', function(eventArgs) {
            let body = eventArgs.currentEntity.getComponent('body');
            if(body) {
                console.log(body.x + '/' + body.y);
            }
        });
    }
}

class OnCameraMoveBehavior extends BlackSheepGameEngine.Behavior {
    constructor(entity) {
        super('onCameraMove', entity);
        entity.addEventListener('cameraMove', function(eventArgs) {
            let body = eventArgs.currentEntity.getComponent('body');
            let move = eventArgs;
            if(body) {
                body.x -= move.x;
                body.y -= move.y;
            }
        });
    }
}

class Camera extends BlackSheepGameEngine.Entity {
    constructor() {
        super();
        this.addComponent(new BlackSheepGameEngine.BodyComponent(0,0,0,1024,768,1));
        this.addComponent(new BlackSheepGameEngine.MoveComponent(0,0,10,10));
        this.addComponent(new BlackSheepGameEngine.LimitComponent(0,0,2048,768));

        this.addBehavior(new MoveOnKeyPressedBehavior(this,'4','6'));
        this.addBehavior(new BlackSheepGameEngine.MoveBehavior(this));
        this.addBehavior(new BlackSheepGameEngine.LimitBoundBehavior(this));

        this.addEventListener('move', function(eventArgs) {
            const moveComponent = eventArgs.currentEntity.getComponent('move');
            const limitComponent =eventArgs.currentEntity.getComponent('limits');
            const cameraBody = eventArgs.currentEntity.getComponent('body');

            let move = {
                x:moveComponent.speedx,
                y:moveComponent.speedy
            };
            console.log(cameraBody);

            if(cameraBody.x <= limitComponent.left || 
               cameraBody.x + cameraBody.width >= limitComponent.left + limitComponent.width) {
                move.x = 0;    
            }

            if(cameraBody.y <= limitComponent.top ||
               cameraBody.y + cameraBody.height >= limitComponent.top + limitComponent.height) {
                move.y = 0;
            }

            if(move.x || move.y) {
                window.gameEngine.raiseEvent('cameraMove',move);
            }
        });
    }
}

window.gameEngine = new BlackSheepGameEngine.BlackSheepGameEngine();
document.documentElement.addEventListener('gameInit', function() {
    //generating the ground
    for(let i=0; i<32;i++){
        let color = (i<=16)?'linear-gradient(green, #A66829 40%)':'linear-gradient(red, #A66829 40%)';
        let groundTile = new GroundTile((i*64),704, color);
        groundTile.addBehavior(new OnCameraMoveBehavior(groundTile));
        window.gameEngine.addEntity(groundTile);
    }
    //add camera
    window.gameEngine.addEntity(new Camera());
});

window.addEventListener('load', function() {
    window.gameEngine.run();
});