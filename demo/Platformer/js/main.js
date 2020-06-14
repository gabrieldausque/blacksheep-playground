import * as BlackSheepGameEngine from './blacksheepgameengine-build.js';

class Player extends BlackSheepGameEngine.Entity {
    constructor(x,y) {
        super();
        this.addComponent(new BlackSheepGameEngine.BodyComponent(x,y,0,64,64,1));
        this.addComponent(new BlackSheepGameEngine.MoveComponent(0,0,4,10));
        this.addComponent(new BlackSheepGameEngine.ImageComponent('images/piaf.png', 1,1));
        this.addComponent(new StateComponent());
        this.addBehavior(new BlackSheepGameEngine.DrawImageBehavior(this));
        this.addBehavior(new BlackSheepGameEngine.MoveOnKeyPressedBehavior(this,'ArrowLeft','ArrowRight'));
        this.addBehavior(new JumpOnKeyPressBehavior(this, ' '));
        this.addBehavior(new BlackSheepGameEngine.MoveBehavior(this));
        this.addBehavior(new BlackSheepGameEngine.OnCameraMoveBehavior(this));

    }
}

class GroundTile extends BlackSheepGameEngine.Entity {
    constructor(x, y, color) {
        super();
        this.addComponent(new BlackSheepGameEngine.BodyComponent(x,y,0,64,64,0));
        this.addComponent(new BlackSheepGameEngine.CSSImageComponent(color));
        this.addComponent(new BlackSheepGameEngine.CollisionComponent(new BlackSheepGameEngine.Rectangle(0,0,64,64)));

        this.addBehavior(new BlackSheepGameEngine.DrawCSSBehavior(this));
        this.addBehavior(new BlackSheepGameEngine.OnCameraMoveBehavior(this));
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

class Camera extends BlackSheepGameEngine.Entity {
    constructor() {
        super();
        this.addComponent(new BlackSheepGameEngine.BodyComponent(0,0,0,1024,768,1));
        
        this.addComponent(new BlackSheepGameEngine.MoveComponent(0,0,16,16));
        this.addComponent(new BlackSheepGameEngine.LimitComponent(0,0,2048,768));

        this.addBehavior(new BlackSheepGameEngine.MoveOnKeyPressedBehavior(this,'4','6'));
        this.addBehavior(new BlackSheepGameEngine.MoveBehavior(this));
        this.addBehavior(new BlackSheepGameEngine.LimitBoundBehavior(this));
        var behavior = new BlackSheepGameEngine.Behavior('cameraMover', this);
        behavior.previousPosition = {x: 0, y:0};
        behavior.setUpdateHandler(function(eventArgs) {
            const limitComponent =eventArgs.currentEntity.getComponent('limits');
            const cameraBody = eventArgs.currentEntity.getComponent('body');
            const mover = eventArgs.currentEntity.getBehavior('cameraMover');
            let move = {
                x: cameraBody.x - mover.previousPosition.x,
                y: cameraBody.y - mover.previousPosition.y
            };
            
            if((cameraBody.x < limitComponent.left || 
               cameraBody.x + cameraBody.width > limitComponent.left + limitComponent.width )) {
                move.x = 0;    
            }
    
            if(cameraBody.y < limitComponent.top ||
               cameraBody.y + cameraBody.height > limitComponent.top + limitComponent.height) {
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

class StateComponent extends BlackSheepGameEngine.Component {
    constructor() {
        super('state');
        this.state = [];
    }
}

class JumpOnKeyPressBehavior extends BlackSheepGameEngine.Behavior {
    constructor(entity, jumpKey) {
        super('jump',entity);
        this.inputService = window.gameEngine.inputs();
        this.jumpKey = jumpKey;
    }
    update(eventArgs) {
        const currentEntity = eventArgs.currentEntity;
        const moveComponent = currentEntity.getComponent('move');
        const current = currentEntity.getBehavior('jump');
        const stateComponent = currentEntity.getComponent('state');
        console.log(eventArgs);
        if(moveComponent.speedy <= 25 &&
            stateComponent.state === 'jumping') {
            moveComponent.speedy++;
        } else {
            if(current.inputService[current.jumpKey]){
                stateComponent.state = 'jumping';
                moveComponent.speedy = -150;
            }
        }
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

    var player = new Player(0,640);
    window.gameEngine.addEntity(player);
});

window.addEventListener('load', function() {
    window.gameEngine.run();
});