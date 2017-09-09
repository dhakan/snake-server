const Wall = require('./Wall')

class Course {
  constructor (data, grid) {
    this._grid = grid
    this._walls = []

    this._initializeWalls(data)
  }

  _initializeWalls (data) {
    for (const item of data) {
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
}

module.exports = Course
