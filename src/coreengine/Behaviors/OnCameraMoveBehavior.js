import Behavior from './Behavior.js';

export default class OnCameraMoveBehavior extends Behavior {
    constructor(entity) {
        super('onCameraMove', entity);
        entity.addEventListener('cameraMove', function(eventArgs) {
            let body = eventArgs.currentEntity.getComponent('body');
            let move = eventArgs;
            if(body) {
                body.x -= move.x;
                body.y -= move.y;
            }
        });
    }
}