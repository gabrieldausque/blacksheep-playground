export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createEvent(eventName, eventArgs)
{
    var newEvent = new CustomEvent(eventName, eventArgs);
    return newEvent;
}

export class Rectangle {
    constructor(top,left,width,height) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
    bottom() {return this.top + this.height};
    right() { return this.left + this.width};
    intersect(origine, other, otherOrigine) {
        return (origine.x + this.left) <= (otherOrigine.x + other.right())  &&
            (otherOrigine.x + other.left)  <= (origine.x + this.right())  &&
            (origine.y + this.top) <= (otherOrigine.y + other.bottom()) &&
            (otherOrigine.y + other.top) <= (origine.y + this.bottom());
    };
    barycentre() {
        return {
            x: this.left + (this.width/2),
            y: this.top + (this.height/2)
        }
    }
}

