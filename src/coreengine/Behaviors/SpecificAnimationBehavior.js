import Behavior from "./Behavior";

export default class SpecificAnimationBehavior extends Behavior {
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
