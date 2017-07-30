const settings = require('../utils/settings');
const Action = require('./Action');

class ChangeDirectionAction extends Action {

    constructor(player, direction) {
        super();

        this._player = player;
        this._direction = direction;
    }

    get id() {
        return settings.playerActionTypes.DIRECTION_ACTION;
    }

    get isValid() {
        if (this._player.idle) {
            return true;
        }

        const actionIsOpposite = (this._player.direction.value === settings.playerActions[this._direction.value].disallowed);

        return !actionIsOpposite;
    }

    execute() {
        if (!this.isValid) {
            return;
        }

        this._player.direction = this._direction;
    }
}

ChangeDirectionAction.id = settings.playerActionTypes.DIRECTION_ACTION;

module.exports = ChangeDirectionAction;
