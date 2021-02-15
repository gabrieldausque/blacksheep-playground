import Behavior from "./Behavior";

export default class ColliderBoundBehavior extends Behavior {
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