import * as BlacksheepGameEngine from  "../../../../dist/blacksheepgameengine-build.js";

export default class Ball extends BlacksheepGameEngine.Entity {
    constructor() {
        super();
        this.addComponent(new BlacksheepGameEngine.BodyComponent(512,0,0,48,48,3));
        this.addComponent(new BlacksheepGameEngine.MoveComponent(1,0,30,30));
        this.addComponent(new BlacksheepGameEngine.ImageComponent('img/Soccer_ball.svg' ));
        this.addComponent(new BlacksheepGameEngine.LimitComponent(0,0,1024,768));
        this.addComponent(new BlacksheepGameEngine.ForcesComponent());
        this.addComponent(new BlacksheepGameEngine.ElasticityComponent(2));

        this.addBehavior(new BlacksheepGameEngine.DrawImageBehavior(this));
        this.addBehavior(new BlacksheepGameEngine.GravityBehavior(this));
        this.addBehavior(new BlacksheepGameEngine.LimitReboundWithElasticityBehavior(this));
        this.addBehavior(new BlacksheepGameEngine.MoveBehavior(this));
    }
}