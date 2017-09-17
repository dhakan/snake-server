const DIRECTION_ACTION = 'direction-action'
const INVERSE_ACTION = 'inverse-action'

const settings = {
  BACKGROUND_COLOR: '#000000',
  GRID_SIZE: 20,
  GAME_LOOP_TIMER: 100,
  GAME_ROUND_COUNTDOWN_TIMER: 500,
  COUNTDOWN_THRESHOLD: 3,
  REQUIRED_NUMBER_OF_PLAYERS_FOR_GAME_ROUND: 2,
  NUMBER_OF_INITIAL_BODY_PARTS: 3,
  MAXIMUM_CONCURRENT_FRUITS: 3,
  FRUIT_SPAWN_INTERVAL: 1000,
  START_POSITION_OFFSET: 100,
  startPositions: [],
  modes: {
    FREE_MOVEMENT: 'free-movement',
    BLOCKED_BY_WORLD_BOUNDS: 'blocked-by-world-bounds'
  },
  world: {
    WIDTH: 800,
    HEIGHT: 400
  },

  playerActions: {
    UP: {
      type: DIRECTION_ACTION,
      value: 'UP'
    },
    DOWN: {
      type: DIRECTION_ACTION,
      value: 'DOWN'
    },
    LEFT: {
      type: DIRECTION_ACTION,
      value: 'LEFT'
    },
    RIGHT: {
      type: DIRECTION_ACTION,
      value: 'RIGHT'
    },
    INVERSE: {
      type: INVERSE_ACTION
    }
  },

  playerActionTypes: {
    DIRECTION_ACTION: DIRECTION_ACTION,
    INVERSE_ACTION: INVERSE_ACTION
  },

    // WebSocket message protocol
  messages: {
        // Sent from server
    YOU_CONNECTED: 'you-connected',
    ROOM_STATE: 'room-state',
    GAME_ROUND_INITIATED: 'game-round-initiated',
    GAME_ROUND_COUNTDOWN: 'game-round-countdown',
    GAME_STATE: 'game-state',

        // Sent from client
    CLIENT_LOADED: 'client-loaded',
    PLAYER_ACTION: 'player-action',

        // socket.io specific messages
    DISCONNECT: 'disconnect',
    CONNECT: 'connect'
  }
}

settings.startPositions = [{
  x: settings.START_POSITION_OFFSET,
  y: settings.START_POSITION_OFFSET
}, {
  x: settings.world.WIDTH - settings.START_POSITION_OFFSET,
  y: settings.world.HEIGHT - settings.START_POSITION_OFFSET
}, {
  x: settings.world.WIDTH - settings.START_POSITION_OFFSET,
  y: settings.START_POSITION_OFFSET
}, {
  x: settings.START_POSITION_OFFSET,
  y: settings.world.HEIGHT - settings.START_POSITION_OFFSET
}]

const playerActions = settings.playerActions

playerActions.UP.disallowed = playerActions.DOWN.value
playerActions.DOWN.disallowed = playerActions.UP.value
playerActions.LEFT.disallowed = playerActions.RIGHT.value
playerActions.RIGHT.disallowed = playerActions.LEFT.value

settings.mode = settings.modes.FREE_MOVEMENT
// settings.mode = settings.modes.BLOCKED_BY_WORLD_BOUNDS;

module.exports = settings
