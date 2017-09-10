const CollisionHandler = require('../handler/CollisionHandler')
const Grid = require('./Grid')
const Wall = require('./Wall')

class Course {
  constructor (config) {
    this._settings = config.course.settings
    this._grid = new Grid({
      settings: this._settings
    })
    this._collisionHandler = new CollisionHandler(this._grid)
    this._walls = []

    this._initializeWalls(config.course)
  }

  _initializeWalls (data) {
    for (const item of data.walls) {
      const wall = new Wall({
        x: item.x,
        y: item.y
      })
      this._walls.push(wall)
      this._grid.occupyGridSquare(wall)
    }
  }

  get settings () {
    return this._settings
  }

  get walls () {
    return this._walls
  }

  get randomGridPosition () {
    return this._grid.randomGridPosition
  }

  get serialized () {
    const obj = {
      settings: this._settings,
      walls: this._walls.map(wall => wall.serialized)
    }
    return obj
  }

  getStartPosition (playerIndex) {
    return this._settings.startPositions[playerIndex] || this.randomGridPosition
  }

  occupyGridSquare (gameObject) {
    this._grid.occupyGridSquare(gameObject)
  }

  removeObjectFromGrid (gameObject) {
    this._grid.removeObjectFromGrid(gameObject)
  }

  playerWithGameObjectCollision (player) {
    return this._collisionHandler.playerWithGameObjectCollision(player)
  }

  playerWithWorldBoundsCollision (player) {
    return this._collisionHandler.playerWithWorldBoundsCollision(player)
  }
}

module.exports = Course
