import Behavior from "./Behavior";

class AddForcesOnInputBehavior extends Behavior {
    constructor(entity) {
        super('AddForcesOnInput');
    }
    update(event) {
        var forcesbyinput = this.components['forcesbyinput'];
        // TODO: check the usage of this beahvior to finish it
    }
}