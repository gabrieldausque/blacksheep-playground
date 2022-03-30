import Component from "./Component";

export default class CollisionComponent extends Component{
    constructor(rectangle, owner) {
        super('collision');
        this.collisionRectangle = rectangle;
        this.lastCollision = Date.now();
        this.owner = owner
    }

    top() {
        return this.owner.getComponent('body').y + this.collisionRectangle.top;
    }

    left() {
        return this.owner.getComponent('body').x + this.collisionRectangle.left;
    }

    right() {
        return this.left() + this.collisionRectangle.width;
    }

    bottom() {
        return this.top() + this.collisionRectangle.height;
    }

    barycentre() {
        return {
            x: this.left() + this.collisionRectangle.barycentre().x,
            y: this.top() + this.collisionRectangle.barycentre().y
        }
    }

    collide(collided) {
        const origin =
            {
                x: this.owner.getComponent('body').x,
                y: this.owner.getComponent('body').y
            };
        const otherOrigin =
            {
                x: collided.getComponent('body').x,
                y: collided.getComponent('body').y
            };
        const otherRectangle = collided.getComponent('collision').collisionRectangle;
        return this.collisionRectangle.intersect(origin, otherRectangle, otherOrigin);
    }

    generateCollisionEventArg(collided) {
        const collidedCollisionComponent = collided.getComponent('collision');
        const collidedCollisionMatrix = {
            top: this.bottom() <=  collidedCollisionComponent.barycentre().y,
            bottom: this.top() >= collidedCollisionComponent.barycentre().y,
            right: this.left() >= collidedCollisionComponent.barycentre().x,
            left: this.right() <= collidedCollisionComponent.barycentre().x
        };
        return {
            collisionMatrix: collidedCollisionMatrix,
            collided: collided
        }
    }
}