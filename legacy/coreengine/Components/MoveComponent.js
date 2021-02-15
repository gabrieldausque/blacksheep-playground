import Component from "./Component";

export default class MoveComponent extends Component {
    constructor(speedx, speedy, maxSpeedX, maxSpeedY) {
        super('move');
        this.speedx = speedx;
        this.speedy = speedy;
        this.maxSpeedX = maxSpeedX;
        this.maxSpeedY = maxSpeedY;
    }
}
