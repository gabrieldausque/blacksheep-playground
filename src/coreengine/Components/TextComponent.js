import Component from "./Component";

export default class TextComponent extends Component {
    constructor(text) {
        super("text");
        this.text = text;
    }
}
