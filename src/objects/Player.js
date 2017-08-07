const settings = require('../utils/settings')
const BodyPart = require('./BodyPart')
const PlayerColor = require('./PlayerColor')

class Player {
  constructor (id, color) {
    this._id = id
    this._color = color
    this._bodyParts = []
    this._direction = null
    this._alive = true
    this._grid = null
    this._ready = false
    this._playing = false
    this._bodyPartsYetToBeBuilt = 0
  }

  get id () {
    return this._id
  }

  get color () {
    return this._color
  }

  get direction () {
    return this._direction
  }

  set direction (newDirection) {
    this._direction = newDirection
  }

  get alive () {
    return this._alive
  }

  set alive (newValue) {
    this._alive = newValue
  }

  get head () {
    return this._bodyParts[0]
  }

  get bodyParts () {
    return this._bodyParts
  }

  get isLeftOfBounds () {
    return this.head.x < 0
  }

  get isRightOfBounds () {
    return this.head.x > settings.world.WIDTH - settings.GRID_SIZE
  }

  get isAboveBounds () {
    return this.head.y < 0
  }

  get isBelowBounds () {
    return this.head.y > settings.world.HEIGHT - settings.GRID_SIZE
  }

  get isOutsideOfBounds () {
    return this.isLeftOfBounds ||
            this.isRightOfBounds ||
            this.isAboveBounds ||
            this.isBelowBounds
  }

  get ready () {
    return this._ready
  }

  set ready (newValue) {
    this._ready = newValue
  }

  get playing () {
    return this._playing
  }

  set playing (newValue) {
    this._playing = newValue
  }

  get idle () {
    return !this._direction
  }

  get serialized () {
    return {
      id: this._id,
      bodyParts: this._bodyParts.map(bodyPart => bodyPart.serialized),
      color: this._color.serialized
    }
  }

  set grid (newValue) {
    this._grid = newValue
  }

  set bodyPartsYetToBeBuilt (newValue) {
    this._bodyPartsYetToBeBuilt = this._bodyPartsYetToBeBuilt + newValue
  }

  _handleWarpThroughWall (nextPosition) {
    if (nextPosition.x < 0) {
      nextPosition.x = settings.world.WIDTH - settings.GRID_SIZE
    } else if (nextPosition.x > settings.world.WIDTH - settings.GRID_SIZE) {
      nextPosition.x = 0
    } else if (nextPosition.y < 0) {
      nextPosition.y = settings.world.HEIGHT - settings.GRID_SIZE
    } else if (nextPosition.y > settings.world.HEIGHT - settings.GRID_SIZE) {
      nextPosition.y = 0
    }

    return nextPosition
  }

  _handleMove (nextPosition) {
    if (this._direction.value === settings.playerActions.UP.value) {
      nextPosition.y += -settings.GRID_SIZE
    } else if (this._direction.value === settings.playerActions.DOWN.value) {
      nextPosition.y += settings.GRID_SIZE
    } else if (this._direction.value === settings.playerActions.LEFT.value) {
      nextPosition.x += -settings.GRID_SIZE
    } else if (this._direction.value === settings.playerActions.RIGHT.value) {
      nextPosition.x += settings.GRID_SIZE
    }

    if (settings.mode === settings.modes.FREE_MOVEMENT) {
      this._handleWarpThroughWall(nextPosition)
    }

    return nextPosition
  }

  _getNextPosition (head) {
    let nextPosition = {
      x: head.x,
      y: head.y
    }

    nextPosition = this._handleMove(nextPosition)

    return nextPosition
  }

  _moveSingleBodyPart () {
    const oldPosition = this.head.position
    const nextPosition = this._getNextPosition(this.head)

    this._grid.removeObjectFromGrid(this.head)

    this.head.x = nextPosition.x
    this.head.y = nextPosition.y

    this._grid.occupyGridSquare(this.head)

    return oldPosition
  }

  _moveMultipleBodyParts () {
    const tail = this._bodyParts.pop()
    const tailOldPosition = tail.position
    const nextPosition = this._getNextPosition(this.head)

    this._grid.removeObjectFromGrid(tail)

    this.head.type = BodyPart.BODY

    this._bodyParts.unshift(tail)

    tail.type = BodyPart.HEAD

    tail.x = nextPosition.x
    tail.y = nextPosition.y

    this._grid.occupyGridSquare(tail)

    return tailOldPosition
  }

  initBody (position) {
    for (let i = 0; i < settings.NUMBER_OF_INITIAL_BODY_PARTS; i++) {
      this.expandBody(position)
    }
  }

  kill () {
    this._alive = false
    this._bodyParts.forEach(bodyPart => this._grid.removeObjectFromGrid(bodyPart))
  }

  expandBody (position) {
    const type = (!this._bodyParts.length && BodyPart.HEAD) || BodyPart.BODY
    const newBodyPart = new BodyPart(position, type, this)

    this._bodyParts.push(newBodyPart)

    this._grid.occupyGridSquare(newBodyPart)
  }

  reduceBody () {
    const head = this._bodyParts.shift()

    this._grid.removeObjectFromGrid(head)

    if (this._bodyParts.length) {
      this.head.type = BodyPart.HEAD
    } else {
      this.kill()
    }
  }

  move () {
    let tailOldPosition = null

    if (this._bodyParts.length === 1) {
      tailOldPosition = this._moveSingleBodyPart()
    } else {
      tailOldPosition = this._moveMultipleBodyParts()
    }

    if (this._bodyPartsYetToBeBuilt >= 1) {
      this.expandBody(tailOldPosition, BodyPart.BODY)
      this._bodyPartsYetToBeBuilt--
    }
  }

  reset () {
    this._bodyParts = []
    this._alive = true
    this._grid = null
    this._playing = false
    this._bodyPartsYetToBeBuilt = 0
    this._direction = null
  }
}

Player.colors = [
  new PlayerColor('#FF0000'), // Red
  new PlayerColor('#0000FF'), // Blue
  new PlayerColor('#00FF00'), // Green
  new PlayerColor('#FFFF00') // Yellow
]

module.exports = Player
