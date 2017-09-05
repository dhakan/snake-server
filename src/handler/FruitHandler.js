const Fruit = require('../objects/Fruit')

class FruitHandler {
  constructor (grid) {
    this._grid = grid
    this._fruits = new Map()
  }

  createFruit () {
    const position = this._grid.randomGridPosition
    const fruit = new Fruit(position)

    this._fruits.set(fruit.id, fruit)
    this._grid.occupyGridSquare(fruit)
  }

  removeFruit (fruit) {
    this._fruits.delete(fruit.id)
    this._grid.removeObjectFromGrid(fruit)
  }

  get fruits () {
    return this._fruits
  }

}

module.exports = FruitHandler