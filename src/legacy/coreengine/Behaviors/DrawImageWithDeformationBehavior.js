import DrawImageBehavior from "./DrawImageBehavior";

export class DrawImageWithDeformationBehavior extends DrawImageBehavior {
    constructor(entity, rowCount, colCount, animationName, delayFunction, duration) {
        super(entity)
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.animationName = animationName;
        this.delayFunction = delayFunction;
        this.duration = duration;
    }

    createElement(entity, image, body, display) {
        let element = document.createElement('div');
        element.id = entity.id;
        
        element.style.zIndex = body.z;
        element.style.width = body.width + "px";
        element.style.height = body.height + "px";
        element.style.position = "absolute";

        const rowCount = this.rowCount;
        const colCount = this.colCount;
        let delay = 0;
        for(let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            let rowElement = document.createElement('div');
            rowElement.style.height = Math.round(body.height/rowCount) + "px";
            rowElement.style.width = body.width + "px";
            rowElement.style.display = 'table';
            for(let colIndex = 0; colIndex < this.colCount; colIndex++) {
                delay = this.delayFunction(rowIndex, colIndex);
        
                let subElement = document.createElement('div');
                subElement.style.display = "table-cell";
                subElement.style.height = Math.round(body.height/rowCount) + "px";
                subElement.style.width = Math.round(body.width/colCount) + "px";
                subElement.style.backgroundImage = 'url(\'' + image.imagePath + '\')';
                subElement.style.backgroundPositionX = ((image.currentImage.x * body.width) - 
                                                    (body.width/colCount)*colIndex) + "px";
                subElement.style.backgroundPositionY = -((image.currentImage.y * body.height) + 
                                                  (body.height/rowCount)*rowIndex) + "px";
                subElement.style['animation'] = this.duration + 's '+
                this.animationName + ' ' + delay + 'ms linear infinite';
            
                rowElement.appendChild(subElement);
            }
            element.appendChild(rowElement);
        }
        
        display.appendChild(element);
        
        const collision = entity.components['collision'];
        if (collision && window.gameEngine.isDebug) {
            let colElt = document.createElement("div");
            colElt.id = "col" + entity.id;
            colElt.style.borderColor = "red";
            colElt.style.borderWidth = "2px";
            colElt.style.borderStyle = "solid";
            colElt.style.top = collision.collisionRectangle.top + "px";
            colElt.style.left = collision.collisionRectangle.left + "px";
            colElt.style.width = collision.collisionRectangle.width + "px";
            colElt.style.height = collision.collisionRectangle.height + "px";
            colElt.style.position = "absolute";
            element.appendChild(colElt);
        }

        return element;
    }
}
