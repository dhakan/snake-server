const Wall = require('./Wall')

class Course {
  constructor (config) {
    this._settings = config.course.settings
    this._grid = config.grid
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

  get walls () {
    return this._walls
  }

  get serialized () {
    const obj = {
      settings: this._settings,
      walls: this._walls.map(wall => wall.serialized)
    }
    return obj
  }
}

module.exports = Course
