import * as BlackSheepGameEngine from "./blacksheepgameengine-build.js";

export class Tentacles extends BlackSheepGameEngine.Entity {
    constructor() {
        super();
        this.addComponent(new BlackSheepGameEngine.BodyComponent(0,0,0,1024,768,3));
        this.addComponent(new BlackSheepGameEngine.ImageComponent('imgs/tentacle.jpg'));
        
        this.addBehavior(new BlackSheepGameEngine.DrawImageWithDeformationBehavior(
            this, 
            100,
            1, 
            'sinusoid', 
            function(rowCount, colCount) { return - rowCount * 100}, 
            3
            )
        );
    }
}