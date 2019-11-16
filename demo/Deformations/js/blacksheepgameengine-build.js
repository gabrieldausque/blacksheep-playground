export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createEvent(eventName, eventArgs)
{
    var newEvent = new CustomEvent(eventName, eventArgs);
    return newEvent;
}

export class Rectangle {
    constructor(top,left,width,height) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
    bottom() {return this.top + this.height};
    right() { return this.left + this.width};
    intersect(origine, other, otherOrigine) {
        const isIntersect = (origine.x + this.left) <= (otherOrigine.x + other.right())  &&
            (otherOrigine.x + other.left)  <= (origine.x + this.right())  &&
            (origine.y + this.top) <= (otherOrigine.y + other.bottom()) &&
            (otherOrigine.y + other.top) <= (origine.y + this.bottom());
        return isIntersect;
    };
}


export  class Component {
    constructor(name) {
        this.name = name;
    }
}

export  class BodyComponent extends Component {
    constructor(x, y, z, width, height, weight) {
        super('body');
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.weight = weight;
    }
    barycentre() {
        return {
            x : this.x + (this.width/2),
            y : this.y + (this.height/2)
        }
    }
}


export  class CSSComponent extends Component {
    constructor(styles) {
        super('css');
        this.styles = styles;
    }
}

export  class CSSImageComponent extends Component {
    constructor(cssBackgroundText, otherCssText) {
        super('css');
        this.cssBackgroundText = cssBackgroundText;
        this.otherCssText = otherCssText;
    }
}

export  class CollisionComponent extends Component{
    constructor(rectangle) {
        super('collision');
        this.collisionRectangle = rectangle;
        this.lastCollision = Date.now();
    }
}

export  class ElasticityComponent extends Component {
    constructor(elasticity) {
        super('elasticity');
        this.elasticity = Math.max(0,elasticity);
        this.energy = {x:0, y:0};

    }
}

export  class FontComponent extends Component{
    constructor(fontSize, fontColor, textAlign, verticalAlign) {
        super('font');
        this.cssText = "font-size:"+ fontSize +";"+
            "text-align:"+ textAlign +";" +
            "vertical-align:" + verticalAlign + ";" +
            "color:" + fontColor + ";"
    }
}


export  class ForcesByInput extends Component {
    constructor() {
        super('forcesbyinput');
        this.forcesByInput = {}
    }
}

export  class ForcesComponent extends Component {
    constructor() {
        super('forces');
        this.forces = []
    }
    addForce(name, vector) {
        let currentForce = this.getForce(name);
        if(!currentForce || currentForce === null) {
            this.forces.push({ name: name, force: vector});
        } else {
            currentForce.force.x = vector.x;
            currentForce.force.y = vector.y
        }
    }
    getForce(name) {
        for(let index=0;index < this.forces.length;index++) {
            if(this.forces[index].name === name)
                return this.forces[index];
        }
        const defaultForce = {name:name, force:{x:0,y:0}};
        this.forces.push(defaultForce);
        return defaultForce;
    }
}


export  class ImageComponent extends Component {
    constructor(imageRelativePath,
                numberOfRows,
                numberOfColumns) {
        super('image');
        this.imagePath = imageRelativePath;
        this.currentImage = { x:0, y:0};
        this.numberOfRows = numberOfRows;
        this.numberOfColumns = numberOfColumns;
    }
}

export  class LimitComponent extends Component{
    constructor(top, left, width, height) {
        super("limits");
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
}


export  class MoveComponent extends Component {
    constructor(speedx, speedy, maxSpeedX, maxSpeedY) {
        super('move');
        this.speedx = speedx;
        this.speedy = speedy;
        this.maxSpeedX = maxSpeedX;
        this.maxSpeedY = maxSpeedY;
    }
}


export  class TextComponent extends Component {
    constructor(text) {
        super("text");
        this.text = text;
    }
}

export  class Behavior {
    constructor(name, entity) {
        this.name = name;
        this.entity = entity;
        this.entity.addEventListener('gameUpdate', this.update);
    }
    update(event) {}
    draw(event) {}
    setUpdateHandler(updateHandler) {
        this.entity.removeEventListener('gameUpdate', this.update);
        this.update = updateHandler;
        this.entity.addEventListener('gameUpdate', this.update);
    }
}

class AddForcesOnInputBehavior extends Behavior {
    constructor(entity) {
        super('AddForcesOnInput');
    }
    update(event) {
        var forcesbyinput = this.components['forcesbyinput'];
        // TODO: check the usage of this beahvior to finish it
    }
}

export  class ColliderBoundBehavior extends Behavior {
    constructor(entity) {
        super('collider', entity);
        entity.addEventListener('collision', this.onCollision);
    }
    onCollision(collisionEvent) {
        if (Date.now() - this.components['collision'].lastCollision > 150) {
            const body = this.components['body'];
            const collidedBody = collisionEvent.collided.components['body'];
            this.components['collision'].lastCollision = Date.now();
            if(body.barycentre().y <= collidedBody.y ||
                body.barycentre().y >= collidedBody.y + collidedBody.height) {
                this.components['move'].speedy = -(this.components['move'].speedy);
            } else if(body.barycentre().x <= collidedBody.x ||
                      body.barycentre().x >= collidedBody.x + collidedBody.width) {
                this.components['move'].speedx = -(this.components['move'].speedx);
            } else {
                this.components['move'].speedy = -(this.components['move'].speedy);
                this.components['move'].speedx = -(this.components['move'].speedx);
            }
        }
    }
}

class DrawCSSBehavior extends Behavior {
    constructor(entity) {
        super('drawer', entity);
        this.entity.addEventListener('gameDraw', this.draw);
    }
    draw(event) {
        var display = document.getElementById('display');
        var element = document.getElementById(this.id);
        var body = this.components['body'];
        var css = this.components['css'];

        if(!element) {
            element = document.createElement('div');
            element.id = this.id;
            element.style.background = css.cssBackgroundText;
            element.style.zIndex = body.z;
            element.style.width = body.width + "px";
            element.style.height = body.height + "px";
            element.style.position = "absolute";
            element.style.cssText += css.otherCssText;
            display.appendChild(element);
        }
        element.style.top = body.y + "px";
        element.style.left = body.x + "px";
    }
}

export  class DrawImageBehavior extends Behavior {
    constructor(entity) {
        super('drawer', entity);
        this.entity.addEventListener('gameDraw', this.draw);
    }
    draw(event) {
        const display = document.getElementById('display');
        let element = document.getElementById(this.id);
        const body = this.components['body'];
        const image = this.components['image'];

        if (typeof element === 'undefined' || element === null) {
            element = document.createElement('div');
            element.id = this.id;
            element.style.backgroundImage = 'url(\'' + image.imagePath + '\')';
            element.style.backgroundSize = 'initial';
            element.style.zIndex = body.z;
            element.style.width = body.width + "px";
            element.style.height = body.height + "px";
            element.style.position = "absolute";
            let css = this.components['css'];
            if (css) {
                for (let property in css.styles) {
                    if (css.styles.hasOwnProperty(property)) {
                        element.style[property] = css.styles[property];
                    }
                }
            }
            display.appendChild(element);
            const collision = this.components['collision'];
            if (collision && window.gameEngine.isDebug) {
                let colElt = document.createElement("div");
                colElt.id = "col" + this.id;
                colElt.style.borderColor = "red";
                colElt.style.borderWidth = "2px";
                colElt.style.borderStyle = "solid"
                colElt.style.top = collision.collisionRectangle.top + "px";
                colElt.style.left = collision.collisionRectangle.left + "px";
                colElt.style.width = collision.collisionRectangle.width + "px";
                colElt.style.height = collision.collisionRectangle.height + "px";
                colElt.style.position = "absolute";
                element.appendChild(colElt);
            }
        }
        element.style.backgroundPositionX = image.currentImage.x * body.width + "px";
        element.style.backgroundPositionY = image.currentImage.y * body.height + "px";
        element.style.top = body.y + "px";
        element.style.left = body.x + "px";
    }
}

export  class DrawTextBehavior
    extends Behavior {
    constructor(entity){
        super('drawer', entity);
        this.entity.addEventListener('gameDraw', this.draw);
    }
    draw(event) {
        event.ctx.font = "50px Arial";
        event.ctx.textAlign = "center";
        event.ctx.fillText(this.components['text'].text,
            512,50);
    };
}

export  class GravityBehavior extends Behavior {
    constructor(entity) {
        super('gravitor',entity)
    }
    update(event) {
        const body = this.components['body'];
        const move = this.components['move'];
        const forces = this.components['forces'];
        const currentGravityForce = forces.getForce('gravity');
        currentGravityForce.force.y = Math.min(currentGravityForce.force.y + body.weight, move.maxSpeedY);
        //forces.addForce('gravity', currentGravityForce.force);
    }
}

export  class LimitBehavior extends Behavior {
    constructor(name, entity) {
        if(!name || name === null) {
            name = 'limitBehavior';
        }
        super(name, entity);
    }

    update(event) {
        const limitCollision = LimitBehavior.prototype.getLimitCollision.call(this);
        if(limitCollision.x || limitCollision.y) {
            this.dispatchEvent('limitCollision', limitCollision);
        }
    }

    getLimitCollision() {
        const x = this.components['body'].x;
        const y = this.components['body'].y;
        const width = this.components['body'].width;
        const height = this.components['body'].height;
        const limitResults = {
            x:false,
            y:false
        };

        if (x + width >= this.components['limits'].left + this.components['limits'].width) {
            this.components['body'].x = (this.components['limits'].left + this.components['limits'].width) - this.components['body'].width;
            limitResults.x = true;
        } else if (x <= this.components['limits'].left) {
            this.components['body'].x = this.components['limits'].left;
            limitResults.x = true;
        }

        if (y + height >= this.components['limits'].top + this.components['limits'].height) {
            this.components['body'].y = (this.components['limits'].top + this.components['limits'].height) - this.components['body'].height;
            limitResults.y = true;
        } else if (y <= this.components['limits'].top) {
            this.components['body'].y = this.components['limits'].top;
            limitResults.y = true;
        }

        return limitResults;
    }
}

export  class LimitBoundBehavior extends LimitBehavior {
    constructor(entity){
        super('limitBounder',entity);
    }
    update(event) {
        const rebound = super.getLimitCollision.call(this);
        if(rebound.x) {
            this.components['move'].speedx = -(this.components['move'].speedx);
        }
        if(rebound.y) {
            this.components['move'].speedy = -(this.components['move'].speedy);
        }
    }
}

class LimitDeathBehavior extends Behavior {
    constructor(entity) {
        super('limitDeath',entity);
    }
    update(event){
        const rebound = super.getLimitCollision.call(this);
        if (rebound.x || rebound.y)
        {
            this.dispatchEvent('death', this);
        }
    }
}

export  class LimitReboundWithElasticityBehavior extends LimitBehavior {
    constructor(entity) {
        super('limitReboundWithElasticity', entity);
        entity.addEventListener('moveEvent', this.getEnergy);
        entity.addEventListener('moveEvent', this.checkLimits);
    }

    checkLimits(moveEventArg) {
        const bodyComponent = this.getComponent('body');
        const limitComponent = this.getComponent('limits');
        if(bodyComponent.y < limitComponent.top) {
            bodyComponent.y = limitComponent.top;
        } else if (bodyComponent.y + bodyComponent.height > limitComponent.top + limitComponent.height) {
            bodyComponent.y = limitComponent.top + limitComponent.height - bodyComponent.height;
        }
    }

    getEnergy(moveEventArg) {
        const elasticityComponent = this.getComponent('elasticity');
        const moveComponent = this.getComponent('move');
        const forcesComponent = this.getComponent('forces');

        for(let namedForceIndex in forcesComponent.forces) {
            let namedForce = forcesComponent.forces[namedForceIndex];
            if(namedForce.name !== 'rebound') {
                elasticityComponent.energy.x += namedForce.force.x;
                elasticityComponent.energy.y += namedForce.force.y;
            }
        }

        if(elasticityComponent.energy.x < 0) {
            elasticityComponent.energy.x = Math.max(-moveComponent.maxSpeedX * elasticityComponent.elasticity, elasticityComponent.energy.x);
        } else {
            elasticityComponent.energy.x = Math.min(elasticityComponent.energy.x, moveComponent.maxSpeedX * elasticityComponent.elasticity);
        }
        if(elasticityComponent.energy.y < 0) {
            elasticityComponent.energy.y = Math.max(-moveComponent.maxSpeedY * elasticityComponent.elasticity, elasticityComponent.energy.y);
        } else {
            elasticityComponent.energy.y = Math.min(elasticityComponent.energy.y, moveComponent.maxSpeedY * elasticityComponent.elasticity);
        }
    }

    update(eventArg) {
        const limitCollision = super.getLimitCollision.call(this);
        const forcesComponent = this.getComponent('forces');
        const elasticityComponent = this.getComponent('elasticity');
        const moveComponent = this.getComponent('move');
        const reboundForce = forcesComponent.getForce('rebound');

        if(limitCollision.y && reboundForce.force.y === 0) {
            reboundForce.force.y = -elasticityComponent.energy.y;
            moveComponent.speedy = - moveComponent.speedy;
        } else if(reboundForce.force.y < 0) {
            reboundForce.force.y += 1;
        } else if(reboundForce.force.y > 0) {
            reboundForce.force.y -=1;
        }

        if(limitCollision.x && reboundForce.force.x === 0) {
            reboundForce.force.x = -elasticityComponent.energy.x;
            moveComponent.speedx = -moveComponent.speedx;
        } else if(reboundForce.force.x < 0) {
            reboundForce.force.x +=1;
        } else if(reboundForce.force.y > 0) {
            reboundForce.force.x -=1;
        }
    }
}

export  class MoveBehavior extends Behavior {
    constructor(entity) {
        super('mover', entity);
    }
    update(event) {
        const body = this.components['body'];
        const x = body.x;
        const y = body.y;
        const width = body.width;
        const height = body.height;

        const move = this.components['move'];
        const speedx = move.speedx;
        const speedy = move.speedy;

        let forcesX = 0;
        let forcesY = 0;

        if(typeof this.components['forces'] !== 'undefined') {
            let forces = this.components['forces'].forces;
            for (let forceIndex = 0; forceIndex < forces.length; forceIndex++) {
                forcesX += forces[forceIndex].force.x;
                forcesY += forces[forceIndex].force.y;
            }
        }

        let toAddX = speedx + forcesX;
        let toAddY = speedy + forcesY;

        if(toAddX > 0) {
            toAddX = Math.min(toAddX, move.maxSpeedX);
        }  else if(toAddX < 0) {
            toAddX = Math.max(toAddX, -move.maxSpeedX);
        }
        body.x += toAddX;

        if(toAddY > 0) {
            toAddY = Math.min(toAddY, move.maxSpeedY);
        } else {
            toAddY = Math.max(toAddY, -move.maxSpeedY);
        }
        body.y += toAddY;
        this.dispatchEvent('moveEvent',{ x: toAddX, y: toAddY });
    }
}

export  class SpecificAnimationBehavior extends Behavior {
    constructor(entity) {
        super('animator', entity);
        this.lastUpdate = Date.now();
        this.xSpeed = 1;
    }
    update(event) {
        const animator = this.behaviors['animator'];
        if(Date.now() - animator.lastUpdate > 125 ) {
            const image = this.components['image'];
            if(animator.xSpeed > 0) {
                if (image.currentImage.x < image.numberOfColumns - 1) {
                    image.currentImage.x++;
                } else {
                    animator.xSpeed = -animator.xSpeed;
                }
            } else {
                if (image.currentImage.x > 0) {
                    image.currentImage.x--;
                } else {
                    animator.xSpeed = -animator.xSpeed;
                    if(image.currentImage.y < image.numberOfRows -1)
                    {
                        image.currentImage.y++;
                    } else {
                        image.currentImage.y = 0;
                    }
                }
            }
            animator.lastUpdate = Date.now();
        }
    }
}


export  class StandardAnimationBehavior extends Behavior {
    constructor(entity) {
        super('animator', entity);
        this.lastUpdate = Date.now();
    }
    update(event) {
        const animator = this.behaviors['animator'];
        if(Date.now() - animator.lastUpdate > 125 ) {
            const image = this.components['image'];
            if (image.currentImage.x < image.numberOfColumns - 1) {
                image.currentImage.x++;
            } else if(image.currentImage.y < image.numberOfRows - 1) {
                image.currentImage.y++;
            }  else {
                image.currentImage.y = 0;
                image.currentImage.x = 0;
            }
            animator.lastUpdate = Date.now();
            console.log(image.currentImage.y + " : " + image.currentImage.x);
        }
    }
}
let globalEntityId = 0;

export  class Entity {
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




export  class BlackSheepGameEngine{
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
                window.gameEngine.gameLoopId = window.setTimeout(function(){
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
        window.clearTimeout(window.gameEngine.gameLoopId);
    }
}

