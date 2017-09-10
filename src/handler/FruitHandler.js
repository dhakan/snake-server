const Fruit = require('../objects/Fruit')
const settings = require('../utils/settings')

class FruitHandler {
  constructor (grid) {
    this._grid = grid
    this._fruits = new Map()
    this._maximumConcurrentFruits = settings.MAXIMUM_CONCURRENT_FRUITS

    let intervalId = setInterval(() => {

      if (this.length < this._maximumConcurrentFruits) {
        this.spawnFruit()
      }

    }, settings.FRUIT_SPAWN_INTERVAL)
  }

  spawnFruit () {
    const position = this._grid.randomGridPosition
    const fruit = new Fruit(position)

    this._fruits.set(fruit.id, fruit)
    this._grid.occupyGridSquare(fruit)

    return fruit
  }

  removeFruit (fruit) {
    this._fruits.delete(fruit.id)
    this._grid.removeObjectFromGrid(fruit)
  }

  get fruits () {
    return this._fruits
  }

  get length () {
    return this._fruits.size
  }

}

module.exports = FruitHandler