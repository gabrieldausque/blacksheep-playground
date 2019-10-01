import Component from "./Component";

export default class CollisionComponent extends Component{
    constructor(rectangle) {
        super('collision');
        this.collisionRectangle = rectangle;
        this.lastCollision = Date.now();
    }
}