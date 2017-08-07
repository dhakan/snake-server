const chai = require('chai');
const expect = chai.expect;

const settings = require('../src/utils/settings');
const Player = require('../src/objects/Player');
const BodyPart = require('../src/objects/BodyPart');
const Grid = require('../src/objects/Grid');

function createPlayer(numberOfBodyParts = 2) {
    settings.NUMBER_OF_INITIAL_BODY_PARTS = numberOfBodyParts;

    const player = new Player({
        grid: new Grid(),
    });

    player.initBody(settings.startPositions[0]);

    return player;
}

describe('Player', () => {

    beforeEach(() => {
        this.player = createPlayer();
    });

    describe('move', () => {
        it('should not change position when no direction is set', () => {
            const position = this.player.head.position;

            this.player.move();

            expect(position).to.deep.equal(this.player.head.position);
        });

        it('should change position when direction is set', () => {
            this.player.direction = settings.playerActions.UP;

            const initialPosition = this.player.head.position;

            this.player.move();

            expect(this.player.head.position.y).to.equal(initialPosition.y - settings.GRID_SIZE);
        });
    });

    describe('expand body', () => {

        /* TODO not happy having to declare beforeEach here, since there is only one it block */
        beforeEach(() => {
            this.player = createPlayer(0);
        });

        it('should expand the number of body parts', () => {
            expect(this.player.bodyParts.length).to.equal(0);

            this.player.expandBody(settings.startPositions[0]);

            expect(this.player.bodyParts.length).to.equal(1);
            expect(this.player.bodyParts[0].type).to.equal(BodyPart.HEAD);

            this.player.expandBody(settings.startPositions[0]);

            expect(this.player.bodyParts[1].type).to.equal(BodyPart.BODY);
        });
    });

    describe('reduce body', () => {
        it('should reduce the number of body parts and eventually kill the player', () => {
            const initialBodyPartsLength = this.player.bodyParts.length;

            this.player.reduceBody();

            expect(this.player.bodyParts.length).to.not.equal(initialBodyPartsLength);
            expect(this.player.bodyParts[0].type).to.equal(BodyPart.HEAD);
        });
    });

    describe('kill', () => {
        it('should kill the player and remove all contained body parts', () => {
            expect(this.player.bodyParts.length).to.equal(2);

            this.player.kill();

            expect(this.player.alive).to.equal(false);
            expect(this.player.bodyParts.length).to.equal(0);
        });
    });
});