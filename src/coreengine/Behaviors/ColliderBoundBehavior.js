import Behavior from "./Behavior";

export default class ColliderBoundBehavior extends Behavior {
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