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
    update(eventArgs) {}
    draw(eventArgs) {}
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
    update(eventArgs) {
        var forcesbyinput = eventArg.currentEntity.components['forcesbyinput'];
        // TODO: check the usage of this beahvior to finish it
    }
}

export  class ColliderBoundBehavior extends Behavior {
    constructor(entity) {
        super('collider', entity);
        entity.addEventListener('collision', this.onCollision);
    }
    onCollision(eventArgs) {
        if (Date.now() - eventArgs.currentEntity.components['collision'].lastCollision > 150) {
            const body = eventArgs.currentEntity.components['body'];
            const collidedBody = eventArgs.collided.components['body'];
            eventArgs.currentEntity.components['collision'].lastCollision = Date.now();
            if(body.barycentre().y <= collidedBody.y ||
                body.barycentre().y >= collidedBody.y + collidedBody.height) {
                eventArgs.currentEntity.components['move'].speedy = -(eventArgs.currentEntity.components['move'].speedy);
            } else if(body.barycentre().x <= collidedBody.x ||
                      body.barycentre().x >= collidedBody.x + collidedBody.width) {
                eventArgs.currentEntity.components['move'].speedx = -(eventArgs.currentEntity.components['move'].speedx);
            } else {
                eventArgs.currentEntity.components['move'].speedy = -(eventArgs.currentEntity.components['move'].speedy);
                eventArgs.currentEntity.components['move'].speedx = -(eventArgs.currentEntity.components['move'].speedx);
            }
        }
    }
}

export class DrawCSSBehavior extends Behavior {
    constructor(entity) {
        super('drawer', entity);
        this.entity.addEventListener('gameDraw', this.draw);
    }
    draw(eventArgs) {
        let display = document.getElementById('display');
        let element = document.getElementById(eventArgs.currentEntity.id);
        let body = eventArgs.currentEntity.components['body'];
        let css = eventArgs.currentEntity.components['css'];

        if(!element) {
            element = document.createElement('div');
            element.id = eventArgs.currentEntity.id;
            element.style.background = css.cssBackgroundText;
            element.style.zIndex = body.z;
            element.style.width = body.width + 'px';
            element.style.height = body.height + 'px';
            element.style.position = 'absolute';
            element.style.cssText += css.otherCssText;
            display.appendChild(element);
        }
        element.style.top = body.y + 'px';
        element.style.left = body.x + 'px';
    }
}

export  class DrawImageBehavior extends Behavior {
    constructor(entity) {
        super('drawer', entity);
        this.entity.addEventListener('gameDraw', this.draw);
    }

    draw(eventArgs) {
        const display = document.getElementById('display');
        let element = document.getElementById(eventArgs.currentEntity.id);
        const body = eventArgs.currentEntity.components['body'];
        const image = eventArgs.currentEntity.components['image'];
        const drawer = eventArgs.currentEntity.getBehavior('drawer');
        if (typeof element === 'undefined' || element === null) {
            element = drawer.createElement(eventArgs.currentEntity, image, body, display);
        }
        drawer.moveImage(element, image, body);
    }

    moveImage(element, image, body) {
        element.style.backgroundPositionX = image.currentImage.x * body.width + "px";
        element.style.backgroundPositionY = image.currentImage.y * body.height + "px";
        element.style.top = body.y + "px";
        element.style.left = body.x + "px";
    }

    createElement(entity, image, body, display) {
        let element = document.createElement('div');
        element.id = entity.id;
        element.style.backgroundImage = 'url(\'' + image.imagePath + '\')';
        element.style.backgroundSize = 'initial';
        element.style.zIndex = body.z;
        element.style.width = body.width + "px";
        element.style.height = body.height + "px";
        element.style.position = "absolute";
        let css = entity.components['css'];
        if (css) {
            for (let property in css.styles) {
                if (css.styles.hasOwnProperty(property)) {
                    element.style[property] = css.styles[property];
                }
            }
        }
        display.appendChild(element);
        const collision = entity.components['collision'];
        
        if (collision && window.gameEngine.isDebug) {
            let colElt = document.createElement("div");
            colElt.id = "col" + entity.id;
            colElt.style.borderColor = "red";
            colElt.style.borderWidth = "2px";
            colElt.style.borderStyle = "solid";
            colElt.style.top = collision.collisionRectangle.top + "px";
            colElt.style.left = collision.collisionRectangle.left + "px";
            colElt.style.width = collision.collisionRectangle.width + "px";
            colElt.style.height = collision.collisionRectangle.height + "px";
            colElt.style.position = "absolute";
            element.appendChild(colElt);
        }

        return element;
    }
}

export class DrawImageWithDeformationBehavior extends DrawImageBehavior {
    constructor(entity, rowCount, colCount, animationName, delayFunction, duration) {
        super(entity)
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.animationName = animationName;
        this.delayFunction = delayFunction;
        this.duration = duration;
    }

    createElement(entity, image, body, display) {
        let element = document.createElement('div');
        element.id = entity.id;
        
        element.style.zIndex = body.z;
        element.style.width = body.width + "px";
        element.style.height = body.height + "px";
        element.style.position = "absolute";

        const rowCount = this.rowCount;
        const colCount = this.colCount;
        let delay = 0;
        for(let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            let rowElement = document.createElement('div');
            rowElement.style.height = Math.round(body.height/rowCount) + "px";
            rowElement.style.width = body.width + "px";
            rowElement.style.display = 'table';
            for(let colIndex = 0; colIndex < this.colCount; colIndex++) {
                delay = this.delayFunction(rowIndex, colIndex);
        
                let subElement = document.createElement('div');
                subElement.style.display = "table-cell";
                subElement.style.height = Math.round(body.height/rowCount) + "px";
                subElement.style.width = Math.round(body.width/colCount) + "px";
                subElement.style.backgroundImage = 'url(\'' + image.imagePath + '\')';
                subElement.style.backgroundPositionX = ((image.currentImage.x * body.width) - 
                                                    (body.width/colCount)*colIndex) + "px";
                subElement.style.backgroundPositionY = -((image.currentImage.y * body.height) + 
                                                  (body.height/rowCount)*rowIndex) + "px";
                subElement.style['animation'] = this.duration + 's '+
                this.animationName + ' ' + delay + 'ms linear infinite';
            
                rowElement.appendChild(subElement);
            }
            element.appendChild(rowElement);
        }
        
        display.appendChild(element);
        
        const collision = entity.components['collision'];
        if (collision && window.gameEngine.isDebug) {
            let colElt = document.createElement("div");
            colElt.id = "col" + entity.id;
            colElt.style.borderColor = "red";
            colElt.style.borderWidth = "2px";
            colElt.style.borderStyle = "solid";
            colElt.style.top = collision.collisionRectangle.top + "px";
            colElt.style.left = collision.collisionRectangle.left + "px";
            colElt.style.width = collision.collisionRectangle.width + "px";
            colElt.style.height = collision.collisionRectangle.height + "px";
            colElt.style.position = "absolute";
            element.appendChild(colElt);
        }

        return element;
    }
}


export  class DrawTextBehavior
    extends Behavior {
    constructor(entity){
        super('drawer', entity);
        this.entity.addEventListener('gameDraw', this.draw);
    }
    draw(eventArgs) {
        eventArgs.ctx.font = "50px Arial";
        eventArgs.ctx.textAlign = "center";
        eventArgs.ctx.fillText(eventArgs.currentEntity.components['text'].text,
            512,50);
    };
}

export  class GravityBehavior extends Behavior {
    constructor(entity) {
        super('gravitor',entity)
    }
    update(eventArgs) {
        const body = eventArgs.currentEntity.components['body'];
        const move = eventArgs.currentEntity.components['move'];
        const forces = eventArgs.currentEntity.components['forces'];
        const currentGravityForce = forces.getForce('gravity');
        currentGravityForce.force.y = Math.min(currentGravityForce.force.y + body.weight, move.maxSpeedY);
    }
}

export  class LimitBehavior extends Behavior {
    constructor(name, entity) {
        if(!name || name === null) {
            name = 'limitBehavior';
        }
        super(name, entity);
    }

    update(eventArgs) {
        const limitCollision = super.getLimitCollision(eventArgs.currentEntity);
        if(limitCollision.x || limitCollision.y) {
            eventArgs.currentEntity.dispatchEvent('limitCollision', limitCollision);
        }
    }

    getLimitCollision(entity) {
        const x = entity.components['body'].x;
        const y = entity.components['body'].y;
        const width = entity.components['body'].width;
        const height = entity.components['body'].height;
        const limitResults = {
            x:false,
            y:false
        };

        if (x + width > entity.components['limits'].left + entity.components['limits'].width) {
            limitResults.x = true;
        } else if (x < entity.components['limits'].left) {
            limitResults.x = true;
        }

        if (y + height > entity.components['limits'].top + entity.components['limits'].height) {
            limitResults.y = true;
        } else if (y < entity.components['limits'].top) {
            limitResults.y = true;
        }

        return limitResults;
    }
}

export  class LimitBoundBehavior extends LimitBehavior {
    constructor(entity){
        super('limitBounder',entity);
    }
    update(eventArgs) {
        const rebound = super.getLimitCollision.call(this, eventArgs.currentEntity);
        const currentEntity = eventArgs.currentEntity;
        let hasRebound = false;
        if(rebound.x) {
            eventArgs.currentEntity.components['body'].x = eventArgs.currentEntity.components['body'].x - eventArgs.currentEntity.components['move'].speedx;
            eventArgs.currentEntity.components['move'].speedx = -(eventArgs.currentEntity.components['move'].speedx);
            hasRebound = true;
        }
        if(rebound.y) {
            eventArgs.currentEntity.components['body'].y = eventArgs.currentEntity.components['body'].y - eventArgs.currentEntity.components['move'].speedy;
            eventArgs.currentEntity.components['move'].speedy = -(eventArgs.currentEntity.components['move'].speedy);
            hasRebound = true;
        }

        if(hasRebound) {
            currentEntity.dispatchEvent('rebound', eventArgs);
        }
    }
}

class LimitDeathBehavior extends Behavior {
    constructor(entity) {
        super('limitDeath',entity);
    }
    update(eventArgs){
        const rebound = super.getLimitCollision(eventArgs.currentEntity);
        if (rebound.x || rebound.y)
        {
            eventArgs.currentEntity.dispatchEvent('death', this);
        }
    }
}

export  class LimitReboundWithElasticityBehavior extends LimitBehavior {
    constructor(entity) {
        super('limitReboundWithElasticity', entity);
    }

    update(eventArgs) {
        const limitCollision = super.getLimitCollision(eventArgs.currentEntity);
        const forcesComponent = eventArgs.currentEntity.getComponent('forces');
        const elasticityComponent = eventArgs.currentEntity.getComponent('elasticity');
        const moveComponent = eventArgs.currentEntity.getComponent('move');
        const reboundForce = forcesComponent.getForce('rebound');
        
        if(limitCollision.y && reboundForce.force.y === 0) {
            reboundForce.force.y = 0;
            for(let i = 0; i < forcesComponent.forces.length;i++) {
                if(forcesComponent.forces[i] !== reboundForce) {
                    reboundForce.force.y -= forcesComponent.forces[i].force.y
                }
            }
            reboundForce.force.y = reboundForce.force.y * elasticityComponent.elasticity;
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

export  class LimitStopBehavior extends LimitBehavior {
    constructor(entity){
        super('limitStopper',entity);
    }
    update(eventArgs) {
        const rebound = super.getLimitCollision.call(this, eventArgs.currentEntity);
        const currentEntity = eventArgs.currentEntity;
        let hasRebound = false;
        if(rebound.x) {
            eventArgs.currentEntity.components['body'].x = eventArgs.currentEntity.components['body'].x - eventArgs.currentEntity.components['move'].speedx;
            eventArgs.currentEntity.components['move'].speedx = 0;
            hasRebound = true;
        }
        if(rebound.y) {
            eventArgs.currentEntity.components['body'].y = eventArgs.currentEntity.components['body'].y - eventArgs.currentEntity.components['move'].speedy;
            eventArgs.currentEntity.components['move'].speedy = 0;
            hasRebound = true;
        }

        if(hasRebound) {
            currentEntity.dispatchEvent('rebound', eventArgs);
        }
    }
}

export  class MoveBehavior extends Behavior {
    constructor(entity) {
        super('mover', entity);
    }
    update(eventArgs) {
        const body = eventArgs.currentEntity.components['body'];
        const x = body.x;
        const y = body.y;
        const width = body.width;
        const height = body.height;

        const move = eventArgs.currentEntity.components['move'];
        const speedx = move.speedx;
        const speedy = move.speedy;

        let forcesX = 0;
        let forcesY = 0;

        if(typeof eventArgs.currentEntity.components['forces'] !== 'undefined') {
            let forces = eventArgs.currentEntity.components['forces'].forces;
            for (let forceIndex = 0; forceIndex < forces.length; forceIndex++) {
                forcesX += forces[forceIndex].force.x;
                forcesY += forces[forceIndex].force.y;
            }
        }

        let toAddX = speedx + forcesX;
        let toAddY = speedy + forcesY;
        let previousPosition = {
            x: body.x,
            y: body.y
        }

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
        
        if(toAddX || toAddY)
            eventArgs.currentEntity.dispatchEvent('move',{ x: toAddX, y: toAddY, previousPosition: previousPosition });
    }
}

export  class SpecificAnimationBehavior extends Behavior {
    constructor(entity) {
        super('animator', entity);
        this.lastUpdate = Date.now();
        this.xSpeed = 1;
    }
    update(eventArgs) {
        const animator = eventArgs.currentEntity.getBehavior('animator');
        if(Date.now() - animator.lastUpdate > 125 ) {
            const image = eventArgs.currentEntity.components['image'];
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
    update(eventArgs) {
        const animator = eventArgs.currentEntity.getBehavior('animator');
        if(Date.now() - animator.lastUpdate > 125 ) {
            const image = eventArgs.currentEntity.components['image'];
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
    }
    removeEventListener(eventName, eventHandler) {
        if(this.events[eventName] === undefined) {
            this.events[eventName] = [];
        }
        this.events[eventName].splice(this.events[eventName].indexOf(eventHandler),1);
    }
    dispatchEvent(eventName,eventArg) {
        if(this.events[eventName] !== undefined) {
            var handlers = this.events[eventName];
            for(var handlerCount=0;handlerCount < handlers.length;handlerCount++)
            {
                if(handlers[handlerCount]) {
                    if(eventArg) {
                        eventArg.currentEntity = this;
                    } else {
                        eventArg = {
                            currentEntity : this
                        };
                    }
                    handlers[handlerCount](eventArg);
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
    raiseEvent(eventName, eventArg) {
        for(var entityCount = 0;entityCount < this.entities.length;entityCount++) {
            this.entities[entityCount].dispatchEvent(eventName, eventArg);
        }
    }
    update() {
        var event = createEvent('gameUpdate', {});
        document.documentElement.dispatchEvent(event);
        this.raiseEvent('gameUpdate', {});
        for(var entityCount = 0; entityCount < this.entities.length;entityCount++) {
            var collider = this.entities[entityCount];
            for(var collidedCount = 0; collidedCount < this.entities.length;collidedCount++) {
                var collided = this.entities[collidedCount];
                if(collider !== collided &&
                    collider.components['collision'] &&
                    collided.components['collision'] &&
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
            },1000/60);
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

