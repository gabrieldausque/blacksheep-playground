import Component from "./Component";

export default class ForcesComponent extends Component {
    constructor() {
        super('forces');
        this.forces = []
    }
    addForce(name, vector) {
        this.forces.push({ name: name, force: vector});
    }
    getForce(name) {
        for(let index=0;index < this.forces.length;index++) {
            if(this.forces[index].name === name)
                return this.forces[index];
        }
        return undefined;
    }
}
