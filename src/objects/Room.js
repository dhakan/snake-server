const uuid = require("uuid/v4");

const settings = require("../utils/settings");
const NetworkHandler = require("../handler/NetworkHandler");
const FruitHandler = require("../handler/FruitHandler");
const BodyPart = require("./BodyPart");
const Player = require("./Player");
const Course = require("./Course");
const Fruit = require("./Fruit");
// const GameRound = require("./GameRound");
const ChangeDirectionAction = require("../actions/ChangeDirectionAction");
const InverseDirectionAction = require("../actions/InverseDirectionAction");

const logger = require("../utils/logger");

class Room {
  constructor(config) {
    this._id = uuid();
    this._gameLoopTimerId = null;
    this._playerActionListenerId = null;

    this._players = new Map();
    this._playerActions = new Map();

    this._unloadedCourses = config.courses;
    this._course = new Course({
      course: this.randomCourse,
    });

    this._fruitHandler = new FruitHandler({
      course: this._course,
    });
    this._networkHandler = config.networkHandler;

    this._attachNetworkListeners();
    this._start();
  }

  get id() {
    return this._id;
  }

  get initialState() {
    const initialState = {
      id: this.id,
      players: Array.from(this._players.values()).map(
        (player) => player.serialized
      ),
      course: this._course.serialized,
    };

    return initialState;
  }

  get state() {
    const state = {
      id: this.id,
      players: Array.from(this._players.values())
        .filter((player) => player.alive)
        .map((player) => player.serialized),
      fruits: Array.from(this._fruitHandler.fruits.values()).map(
        (fruit) => fruit.serialized
      ),
      walls: this._course.walls.map((wall) => wall.serialized),
    };

    return state;
  }

  get randomCourse() {
    const randomIndex = Math.floor(
      Math.random() * this._unloadedCourses.length
    );
    const course = this._unloadedCourses[randomIndex];

    return course;
  }

  _addPlayerListeners() {
    this._playerActionListenerId = this._onPlayerAction.bind(this);
    this._networkHandler.on(
      NetworkHandler.events.PLAYER_ACTION,
      this._playerActionListenerId
    );
  }

  _handleRemoveListeners() {
    if (this._playerActionListenerId) {
      this._networkHandler.removeListener(
        NetworkHandler.events.PLAYER_ACTION,
        this._playerActionListenerId
      );
    }
  }

  _attachNetworkListeners() {
    this._networkHandler.on(
      NetworkHandler.events.CONNECT,
      this._onPlayerConnected.bind(this)
    );
    this._networkHandler.on(
      NetworkHandler.events.CLIENT_LOADED,
      this._onClientLoaded.bind(this)
    );
    this._networkHandler.on(
      NetworkHandler.events.DISCONNECT,
      this._onPlayerDisconnected.bind(this)
    );
  }

  _emitRoomState() {
    this._networkHandler.emitRoomState(this.initialState);
  }

  _emitGameState() {
    this._networkHandler.emitGameState(this.state);
  }

  _onPlayerConnected(id) {
    this._addPlayer(id);
  }

  _onClientLoaded(id) {
    const player = this._players.get(id);
    this._initPlayer(player);
    this._emitRoomState();
  }

  _onPlayerDisconnected(id) {
    this._removePlayer(id);
  }

  _addPlayer(id) {
    const freeColors = Player.colors.filter((color) => !color.occupied);
    const randomColor =
      freeColors[Math.floor(Math.random() * freeColors.length)];
    const player = new Player({
      id: id,
      color: randomColor,
    });

    randomColor.occupied = true;

    this._players.set(id, player);

    return player;
  }

  _removePlayer(id) {
    const player = this._players.get(id);

    player.kill();

    player.color.occupied = false;

    this._players.delete(id);
    this._playerActions.delete(id)
  }

  _initPlayer(player) {
    const position = this._course.getStartPosition();

    this._playerActions.set(player.id, new Map());

    player.reset()
    player.course = this._course;
    player.initBody(position);
  }

  _start() {
    logger.info("Game round started", this.id);

    this._isRunning = true;

    this._addPlayerListeners();

    this._gameLoopTimerId = setInterval(() => {
      this._handleExecuteActions();
      this._movePlayers();
      this._detectCollisions();
      this._emitGameState();
    }, settings.GAME_LOOP_TIMER);
  }

  _addPlayerAction(playerId, action) {
    this._playerActions.get(playerId).set(action.id, action);
  }

  _onPlayerAction(payload) {
    const player = this._players.get(payload.id);

    // TODO should this function even run when a player not in this GameRound submits a player action?
    if (!player) {
      return;
    }

    let action;

    switch (payload.action.type) {
      case settings.playerActionTypes.DIRECTION_ACTION:
        action = new ChangeDirectionAction(player, payload.action);
        break;
      case settings.playerActionTypes.INVERSE_ACTION:
        action = new InverseDirectionAction(player);
        break;
      default:
        logger.info("Unknown player action...");
    }

    this._addPlayerAction(player.id, action);
  }

  _handleExecuteActions() {
    for (const player of Array.from(this._players.values()).filter(
      (player) => player.alive
    )) {
      const playerActions = this._playerActions.get(player.id);

      if (!playerActions) {
        return
      }

      if (playerActions.get(InverseDirectionAction.id)) {
        playerActions.get(InverseDirectionAction.id).execute();
        playerActions.delete(InverseDirectionAction.id);
      }

      if (playerActions.get(ChangeDirectionAction.id)) {
        playerActions.get(ChangeDirectionAction.id).execute();
        playerActions.delete(ChangeDirectionAction.id);
      }
    }
  }

  _movePlayers() {
    for (const player of Array.from(this._players.values()).filter(
      (player) => player.alive && !player.idle
    )) {
      player.move();
    }
  }

  _detectCollisions() {
    function detectPlayerWithWorldBoundsCollision() {
      // Player to world bounds collision
      for (const player of Array.from(this._players.values()).filter(
        (player) => player.alive && !player.idle
      )) {
        const collision = this._course.playerWithWorldBoundsCollision(player);

        if (collision) {
          collidingPlayers.push(player);
        }
      }
    }

    function detectPlayerWithGameObjectCollision() {
      for (const player of Array.from(this._players.values()).filter(
        (player) => player.alive && !player.idle
      )) {
        const collision = this._course.playerWithGameObjectCollision(player);

        if (!collision) {
          return;
        }

        for (const gameObject of collision) {
          // Player to fruit
          if (gameObject instanceof Fruit) {
            this._fruitHandler.removeFruit(gameObject);
            player.bodyPartsYetToBeBuilt = gameObject.value;
            this._networkHandler.emitFruitCollected(player);
          } else if (gameObject instanceof BodyPart) {
            collidingPlayers.push(player);
          } else if (gameObject instanceof Wall) {
            collidingPlayers.push(player);
          }
        }
      }
    }

    const collidingPlayers = [];

    if (settings.mode === settings.modes.BLOCKED_BY_WORLD_BOUNDS) {
      detectPlayerWithWorldBoundsCollision.call(this);
    }
    detectPlayerWithGameObjectCollision.call(this);

    for (const player of collidingPlayers) {
      player.reduceBody();
      this._networkHandler.emitPlayerReduction();

      if (!player.alive) {
        this._networkHandler.emitPlayerDied();
        this._initPlayer(player)
      }
    }
  }
}

module.exports = Room;
