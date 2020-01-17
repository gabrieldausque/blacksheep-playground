import * as BlackSheepGameEngine from './blacksheepgameengine-build.js';

class GroundTile extends BlackSheepGameEngine.Entity {
    constructor(x, y, color) {
        super();
        this.addComponent(new BlackSheepGameEngine.BodyComponent(x,y,0,64,64,0));
        this.addComponent(new BlackSheepGameEngine.CSSImageComponent(color));
        this.addComponent(new BlackSheepGameEngine.CollisionComponent(new BlackSheepGameEngine.Rectangle(0,0,64,64)));

        this.addBehavior(new BlackSheepGameEngine.DrawCSSBehavior(this));
        this.addBehavior(new OnCameraMoveBehavior(this));
    }
}

class MoveOnKeyPressedBehavior extends BlackSheepGameEngine.Behavior {
    constructor(entity, leftKey, rightKey, upKey, downKey, speedAcceleration) {
        super('moveOnKeyPress', entity);
        this.inputService = window.gameEngine.inputs();
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.upKey = upKey;
        this.downKey = downKey;
        this.speedAcceleration = speedAcceleration;
    }
    update(eventArgs) {
        let move = { 
            x:0,
            y:0
        };
        const currentEntity = eventArgs.currentEntity;
        const moveOnKeyPressBehavior = currentEntity.getBehavior('moveOnKeyPress');
        const moveComponent = currentEntity.getComponent('move');
        
        const newSpeedXAbs = (moveOnKeyPressBehavior.speedAcceleration)?
            (Math.min(moveComponent.maxSpeedX, Math.abs(moveComponent.speedx) + moveOnKeyPressBehavior.speedAcceleration)):
            moveComponent.maxSpeedX;
        const newSpeedYAbs = (moveOnKeyPressBehavior.speedAcceleration)?
            (Math.min(moveComponent.maxSpeedY, Math.abs(moveComponent.speedy) + moveOnKeyPressBehavior.speedAcceleration)):
            moveComponent.maxSpeedY;

        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.leftKey]) {
            move.x = -newSpeedXAbs;
        }
        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.rightKey]) {
            move.x = newSpeedXAbs;
        }
        
        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.upKey]) {
            move.y = -newSpeedYAbs;
        }
        if(moveOnKeyPressBehavior.inputService[moveOnKeyPressBehavior.downKey]) {
            move.y = newSpeedYAbs;
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
        
        this.addComponent(new BlackSheepGameEngine.MoveComponent(0,0,16,16));
        this.addComponent(new BlackSheepGameEngine.LimitComponent(0,0,2048,768));

        this.addBehavior(new MoveOnKeyPressedBehavior(this,'4','6'));
        this.addBehavior(new BlackSheepGameEngine.MoveBehavior(this));
        this.addBehavior(new BlackSheepGameEngine.LimitStopBehavior(this));
        var behavior = new BlackSheepGameEngine.Behavior('mover', this);
        behavior.previousPosition = {x: 0, y:0};
        behavior.setUpdateHandler(function(eventArgs) {
            const limitComponent =eventArgs.currentEntity.getComponent('limits');
            const cameraBody = eventArgs.currentEntity.getComponent('body');
            const mover = eventArgs.currentEntity.getBehavior('mover');
            let move = {
                x: cameraBody.x - mover.previousPosition.x,
                y: cameraBody.y - mover.previousPosition.y
            };
            
            if((cameraBody.x <= limitComponent.left || 
               cameraBody.x + cameraBody.width >= limitComponent.left + limitComponent.width )) {
                move.x = 0;    
            }
    
            if(cameraBody.y <= limitComponent.top ||
               cameraBody.y + cameraBody.height >= limitComponent.top + limitComponent.height) {
                move.y = 0;
            }
    
            if(move.x || move.y) {
                window.gameEngine.raiseEvent('cameraMove',move);
            }

            mover.previousPosition.x = cameraBody.x;
            mover.previousPosition.y = cameraBody.y;
        });
        this.addBehavior(behavior);
    }
}

window.gameEngine = new BlackSheepGameEngine.BlackSheepGameEngine();
document.documentElement.addEventListener('gameInit', function() {
    //generating the ground
    for(let i=0; i<32;i++){
        let color = (i<=16)?'linear-gradient(green, #A66829 40%)':'linear-gradient(red, #A66829 40%)';
        let groundTile = new GroundTile((i*64), 704, color);
        window.gameEngine.addEntity(groundTile);
    }

    //create one platform
    for(let i=0; i<5;i++) {
        let platformTile = new GroundTile((i*64) + 500, 576, 'linear-gradient(green, #A66829 40%)');
        window.gameEngine.addEntity(platformTile);
    }

    //add camera
    var camera = new Camera();
    window.gameEngine.addEntity(camera);
});

window.addEventListener('load', function() {
    window.gameEngine.run();
});