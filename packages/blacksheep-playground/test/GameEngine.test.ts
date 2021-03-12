import * as chai from 'chai';
chai.use(require('chai-as-promised'));
import {expect} from 'chai';
import * as assert from 'assert';
import {GameEngine} from "../src";
const axios = require('axios');

describe('GameEngine tests', () => {

    let game:GameEngine;

    beforeEach(() => {
        game = new GameEngine();
        game.run().then(() => {
            console.log('game running');
        });
    })

    afterEach(() => {
        if(game)
            game.stop();
    })

    after(() => {
        if(game)
            game.stop();
    })

    it('should have start game engine server', async() => {
        const result = await axios.get('http://localhost:3000/scenes/');
        expect(result.status).to.eql(200);
        expect(result.statusText).to.eql('OK');
    })

    it('should have a scene with one entity when game start', async() => {
        assert.fail('Test creation');
    })

})