import Behavior from "./Behavior";

export default class LimitBehavior extends Behavior {
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