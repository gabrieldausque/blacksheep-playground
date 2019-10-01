import Component from "./Component";

export default class BodyComponent extends Component {
    constructor(x, y, z, width, height, weight) {
        super('body');
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.weight = weight;
    }
    barycentre() {
        return {
            x : this.x + (this.width/2),
            y : this.y + (this.height/2)
        }
    }
}
