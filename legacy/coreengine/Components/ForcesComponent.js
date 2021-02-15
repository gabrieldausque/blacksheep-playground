import Component from "./Component";

export default class ForcesComponent extends Component {
    constructor() {
        super('forces');
        this.forces = []
    }
    addForce(name, vector) {
        let currentForce = this.getForce(name);
        if(!currentForce || currentForce === null) {
            this.forces.push({ name: name, force: vector});
        } else {
            currentForce.force.x = vector.x;
            currentForce.force.y = vector.y
        }
    }
    getForce(name) {
        for(let index=0;index < this.forces.length;index++) {
            if(this.forces[index].name === name)
                return this.forces[index];
        }
        const defaultForce = {name:name, force:{x:0,y:0}};
        this.forces.push(defaultForce);
        return defaultForce;
    }
}
