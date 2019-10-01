import Component from "./Component";

export default class FontComponent extends Component{
    constructor(fontSize, fontColor, textAlign, verticalAlign) {
        super('font');
        this.cssText = "font-size:"+ fontSize +";"+
            "text-align:"+ textAlign +";" +
            "vertical-align:" + verticalAlign + ";" +
            "color:" + fontColor + ";"
    }
}
