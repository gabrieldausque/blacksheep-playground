import Component from "./Component";

export default class CSSComponent extends Component {
    constructor(styles) {
        super('css');
        this.styles = styles;
    }
}