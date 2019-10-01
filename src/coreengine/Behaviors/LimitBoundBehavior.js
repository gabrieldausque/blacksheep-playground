import Behavior from "./Behavior";

export default class LimitBoundBehavior extends Behavior {
    constructor(entity){
        super('limitBounder',entity);
    }
    update(event) {
        const x = this.components['body'].x;
        const y = this.components['body'].y;
        const width = this.components['body'].width;
        const height = this.components['body'].height;

        let reboundX = false;
        let reboundY = false;

        if (x + width > this.components['limits'].left + this.components['limits'].width) {
            this.components['body'].x = (this.components['limits'].left + this.components['limits'].width) - this.components['body'].width;
            reboundX = true;
        } else if (x < this.components['limits'].left) {
            this.components['body'].x = this.components['limits'].left;
            reboundX = true;
        }

        if (y + height > this.components['limits'].top + this.components['limits'].height) {
            this.components['body'].y = (this.components['limits'].top + this.components['limits'].height) - this.components['body'].height;
            reboundY = true;
        } else if (y < this.components['limits'].top) {
            this.components['body'].y = this.components['limits'].top;
            reboundY = true;
        }
        if(reboundX) {
            this.components['move'].speedx = -(this.components['move'].speedx);
        }
        if(reboundY) {
            this.components['move'].speedy = -(this.components['move'].speedy);
        }
    }
}