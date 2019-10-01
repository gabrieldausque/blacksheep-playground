export default class Behavior {
    constructor(name, entity) {
        this.name = name;
        this.entity = entity;
        this.entity.addEventListener('gameUpdate', this.update);
    }
    update(event) {}
    draw(event) {}
    setUpdateHandler(updateHandler) {
        this.entity.removeEventListener('gameUpdate', this.update);
        this.update = updateHandler;
        this.entity.addEventListener('gameUpdate', this.update);
    }
}