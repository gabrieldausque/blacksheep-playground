import Behavior from "./Behavior";

export default class StandardAnimationBehavior extends Behavior {
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