import Component from "./Component";

export default class CSSImageComponent extends Component {
    constructor(cssBackgroundText, otherCssText) {
        super('css');
        this.cssBackgroundText = cssBackgroundText;
        this.otherCssText = otherCssText;
    }
}