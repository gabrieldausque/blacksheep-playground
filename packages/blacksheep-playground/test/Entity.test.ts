import * as chai from 'chai';
chai.use(require('chai-as-promised'));
import {expect} from 'chai';
import * as assert from 'assert';
import {Entity, MoveBehavior, SerializedEntityContract} from "../src";

describe('Entity test',() => {

    const serializedEntityContract:SerializedEntityContract = {
        components: [
            {
                contractType:'Component',
                contractName:'Body',
                position: {x: 15, y:15, z:1},
                size: {width:32, height:32, depth:0}
            },
            {
                contractType:'Component',
                contractName:'Speed',
                speeds: {x: 10, y:5, z:2},
                maxSpeeds: {x:10,y:10,z:10}
            }
        ],
        behaviors:[
            {
                contractType:'Behavior',
                contractName:'Move'
            }
        ]
    }

    it('Should create entity with body component and move behavior from string',() => {
        const entity:Entity = Entity.deserialize(JSON.stringify(serializedEntityContract))
        expect(entity).to.be.ok;
        expect(entity.getComponent('Body')).to.be.eql(serializedEntityContract.components[0]);
        expect(entity.getBehavior('Move')).to.be.instanceOf(MoveBehavior);
    })

    it('Should move entity with MoveBehavior with x,y and z behavior on update call', async () => {
        const entity:Entity = Entity.deserialize(JSON.stringify(serializedEntityContract))
        await entity.update();
        expect(entity.getComponent('Body')).to.be.eql({
            contractType:'Component',
            contractName:'Body',
            position: {x: 25, y:20, z:3},
            size: {width:32, height:32, depth:0}
        })
    })
})