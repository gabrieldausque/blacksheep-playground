import * as chai from 'chai';
chai.use(require('chai-as-promised'));
import {expect} from 'chai';
import * as assert from 'assert';
import {BodyComponent, Scene, SerializedSceneContract} from "../src";

describe('Scene Tests',() => {

    const aSceneSerialized:SerializedSceneContract = {
        entities: [
            {
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
                        speeds: {x: 10, y:0, z:0},
                        maxSpeeds: {x:10,y:10,z:10}
                    }
                ],
                behaviors:[
                    {
                        contractType:'Behavior',
                        contractName:'Move'
                    }
                ]
            },
            {
                components: [
                    {
                        contractType:'Component',
                        contractName:'Body',
                        position: {x: 0, y:0, z:0},
                        size: {width:32, height:32, depth:0}
                    },
                    {
                        contractType:'Component',
                        contractName:'Speed',
                        speeds: {x: 10, y:0, z:0},
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
        ]
    }

    it('Should create a scene from serialized scene with two entities', () => {
        const scene = Scene.deserialize(JSON.stringify(aSceneSerialized));
        expect(scene).to.be.ok;
        expect(scene.entities.length).to.eql(2);
    })

    it('Should update all entities of scene when calling update', async () => {
        const scene = Scene.deserialize(JSON.stringify(aSceneSerialized));
        await scene.update();
        expect(scene.entities[0].getComponent<BodyComponent>('Body')?.position.x).to.eql(25);
        expect(scene.entities[1].getComponent<BodyComponent>('Body')?.position.x).to.eql(10);
    })

})