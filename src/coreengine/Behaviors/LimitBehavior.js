import Behavior from "./Behavior";

export default class LimitBehavior extends Behavior {
    constructor(name, entity) {
        if(!name || name === null) {
            name = 'limitBehavior';
        }
        super(name, entity);
    }

    update(eventArgs) {
        const limitCollision = super.getLimitCollision(eventArgs.currentEntity);
        if(limitCollision.x || limitCollision.y) {
            eventArgs.currentEntity.dispatchEvent('limitCollision', limitCollision);
        }
    }

    getLimitCollision(entity) {
        const x = entity.components['body'].x;
        const y = entity.components['body'].y;
        const width = entity.components['body'].width;
        const height = entity.components['body'].height;
        const limitResults = {
            x:false,
            y:false
        };

        if (x + width > entity.components['limits'].left + entity.components['limits'].width) {
            entity.components['body'].x = (entity.components['limits'].left + entity.components['limits'].width) - entity.components['body'].width;
            limitResults.x = true;
        } else if (x < entity.components['limits'].left) {
            entity.components['body'].x = entity.components['limits'].left;
            limitResults.x = true;
        }

        if (y + height > entity.components['limits'].top + entity.components['limits'].height) {
            entity.components['body'].y = (entity.components['limits'].top + entity.components['limits'].height) - entity.components['body'].height;
            limitResults.y = true;
        } else if (y < entity.components['limits'].top) {
            entity.components['body'].y = entity.components['limits'].top;
            limitResults.y = true;
        }

        return limitResults;
    }
}