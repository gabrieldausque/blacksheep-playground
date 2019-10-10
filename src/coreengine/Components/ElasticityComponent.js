import Component from "./Component";

export default class ElasticityComponent extends Component {
    constructor(elasticity) {
        super('elasticity');
        this.elasticity = Math.max(0,elasticity);
        this.energy = {x:0, y:0};

    }
}