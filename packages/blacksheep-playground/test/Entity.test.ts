import * as chai from 'chai';
chai.use(require('chai-as-promised'));
import {expect} from 'chai';
import * as assert from 'assert';
import {Entity, SerializedEntityContract} from "../src";

describe('Entity test',() => {

    const serializedEntityContract:SerializedEntityContract = {
        components: [
            {
                contractType:'Component',
                contractName:'Body',
                position: {x: 15, y:15, z:1},
                size: {width:32, height:32, depth:0}
            }
        ],
        behaviors:[]
    }

    it('Should create entity with body component from string',() => {
        const entity:Entity = Entity.deserialize(JSON.stringify(serializedEntityContract))
        expect(entity).to.be.ok;
        expect(entity.getComponent('Component','Body')).to.be.eql(serializedEntityContract.components[0]);
    })
})