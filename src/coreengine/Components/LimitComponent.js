import Component from "./Component";

export default class LimitComponent extends Component{
    constructor(top, left, width, height) {
        super("limits");
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
}
