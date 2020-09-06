import Component from "./Component";

export default class ImageComponent extends Component {
    constructor(imageRelativePath,
                numberOfRows,
                numberOfColumns) {
        super('image');
        this.imagePath = imageRelativePath;
        this.currentImage = { x:0, y:0};
        this.numberOfRows = numberOfRows;
        this.numberOfColumns = numberOfColumns;
    }
}