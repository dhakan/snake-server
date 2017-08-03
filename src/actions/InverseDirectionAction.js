const settings = require('../utils/settings');
const Action = require('./Action');

class InverseDirectionAction extends Action {

    constructor(player) {
        super();

        this._player = player;
    }

    get id() {
        return settings.playerActionTypes.INVERSE_ACTION;
    }

    get isValid() {
        return !this._player.idle;
    }

    _getNewDirectionWhenDividedByWalls(tail, tailMinusOne) {
        let direction = this._player.direction;

        // Divided by horizontal walls
        if (tail.y === settings.world.HEIGHT - settings.GRID_SIZE &&
            tailMinusOne.y === 0) {
            direction = settings.playerActions.UP;
        } else if (tailMinusOne.y === settings.world.HEIGHT - settings.GRID_SIZE &&
            tail.y === 0) {
            direction = settings.playerActions.DOWN;
        }

        // Divided by vertical walls
        if (tail.x === settings.world.WIDTH - settings.GRID_SIZE &&
            tailMinusOne.x === 0) {
            direction = settings.playerActions.LEFT;
        } else if (tailMinusOne.x === settings.world.WIDTH - settings.GRID_SIZE &&
            tail.x === 0) {
            direction = settings.playerActions.RIGHT;
        }

        return direction;
    }

    _inverseSingleBodyPart() {
        switch (this._player.direction.value) {
            case settings.playerActions.UP.value:
                this._player.direction = settings.playerActions.DOWN;
                break;
            case settings.playerActions.DOWN.value:
                this._player.direction = settings.playerActions.UP;
                break;
            case settings.playerActions.LEFT.value:
                this._player.direction = settings.playerActions.RIGHT;
                break;
            case settings.playerActions.RIGHT.value:
                this._player.direction = settings.playerActions.LEFT;
                break;
        }
    }

    _inverseMultipleBodyParts(bodyParts) {
        const tail = bodyParts[bodyParts.length - 1];
        const tailMinusOne = bodyParts[bodyParts.length - 2];

        if (tail.x === tailMinusOne.x) {
            if (tail.y > tailMinusOne.y) {
                this._player.direction = settings.playerActions.DOWN;
            } else {
                this._player.direction = settings.playerActions.UP;
            }
        } else if (tail.y === tailMinusOne.y) {
            if (tail.x > tailMinusOne.x) {
                this._player.direction = settings.playerActions.RIGHT;
            } else {
                this._player.direction = settings.playerActions.LEFT;
            }
        }

        this._player.direction = this._getNewDirectionWhenDividedByWalls(tail, tailMinusOne);

        this._player.bodyParts.reverse();
    }

    execute() {
        if (!this.isValid) {
            return;
        }

        const bodyParts = this._player.bodyParts;

        if (bodyParts.length === 1) {
            this._inverseSingleBodyPart();
        } else {
            this._inverseMultipleBodyParts(bodyParts);
        }
    }
}

InverseDirectionAction.id = settings.playerActionTypes.INVERSE_ACTION;

module.exports = InverseDirectionAction;
