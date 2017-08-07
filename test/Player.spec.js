const chai = require('chai');
const expect = chai.expect;

const settings = require('../src/utils/settings');
const Player = require('../src/objects/Player');
const Grid = require('../src/objects/Grid');

describe('Player', () => {

    describe('movement', () => {

        it('should not move when no direction has been set', () => {
            const player = new Player({
                grid: new Grid(),
            });

            player.initBody(settings.startPositions[0]);

            const position = player.head.position;

            player.move();

            expect(position).to.deep.equal(player.head.position);
        });

        it('should move according to direction', () => {
            const player = new Player({
                grid: new Grid(),
                direction: settings.playerActions.UP,
            });

            player.initBody(settings.startPositions[0]);

            const initialPosition = player.head.position;

            player.move();

            expect(player.head.position.y).to.equal(initialPosition.y - settings.GRID_SIZE);
        });
    });
});