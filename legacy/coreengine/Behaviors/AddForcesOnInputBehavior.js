import Behavior from "./Behavior";

class AddForcesOnInputBehavior extends Behavior {
    constructor(entity) {
        super('AddForcesOnInput');
    }
    update(eventArgs) {
        var forcesbyinput = eventArg.currentEntity.components['forcesbyinput'];
        // TODO: check the usage of this beahvior to finish it
    }
}