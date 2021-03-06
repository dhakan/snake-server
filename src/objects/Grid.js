const settings = require('../utils/settings')
const GridSquare = require('./GridSquare')

class Grid {
  constructor (config) {
    this._grid = new Map()

    this._initializeGrid(config.settings)
  }

  get freeGridSquares () {
    const gridSquares = Array.from(this._grid.values())
    const freeGridSquares = gridSquares.filter(gridSquare => !gridSquare.occupied)

    return freeGridSquares
  }

  get randomGridPosition () {
    const freeGridSquares = this.freeGridSquares
    const randomIndex = Math.floor(Math.random() * freeGridSquares.length)
    const randomGridSquare = freeGridSquares[randomIndex]

    return randomGridSquare.location
  }

  _initializeGrid (courseSettings) {
    const gridSize = settings.GRID_SIZE
    const worldWidth = (courseSettings.world.width || settings.world.WIDTH)
    const worldHeight = (courseSettings.world.height || settings.world.HEIGHT)

    for (let x = 0; x <= worldWidth - gridSize; x = x + gridSize) {
      for (let y = 0; y <= worldHeight - gridSize; y = y + gridSize) {
        const location = {
          x: x,
          y: y
        }
        const key = this.generateGridKey(location)

        this._grid.set(key, new GridSquare(key, location))
      }
    }
  }

  getGridSquare (position) {
    const key = this.generateGridKey(position)
    const gridSquare = this._grid.get(key)

    return gridSquare
  }

  occupyGridSquare (gameObject) {
    const gridSquare = this.getGridSquare(gameObject.position)

    if (gridSquare) {
      gridSquare.addGameObject(gameObject)
    }
  }

  removeObjectFromGrid (gameObject) {
    const gridSquare = this.getGridSquare(gameObject.position)

    if (gridSquare) {
      gridSquare.removeGameObject(gameObject)
    }
  }

  generateGridKey (position) {
    return `${position.x}-${position.y}`
  }
}

module.exports = Grid
