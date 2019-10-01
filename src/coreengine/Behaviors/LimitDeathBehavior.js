import Behavior from "./Behavior";

class LimitDeathBehavior extends Behavior {
    constructor(entity) {
        super('limitDeath',entity);
    }
    update(event){
        var x = this.components['body'].x;
        var y = this.components['body'].y;
        var width = this.components['body'].width;
        var height = this.components['body'].height;

        if ((x + width > this.components['limits'].left + this.components['limits'].width)
            || (x < this.components['limits'].left)
            || (y + height > this.components['limits'].top + this.components['limits'].height)
            || (y < this.components['limits'].top))
        {
            this.dispatchEvent('death', this);
        }
    }
}