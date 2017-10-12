const Fruit = require('../objects/Fruit')
const settings = require('../utils/settings')

class FruitHandler {
  constructor (config) {
    this._course = config.course
    this._fruits = new Map()

    setInterval(() => {
      if (this.length < settings.MAXIMUM_CONCURRENT_FRUITS) {
        this.spawnFruit()
      }
    }, settings.FRUIT_SPAWN_INTERVAL)
  }

  spawnFruit () {
    const position = this._course.randomGridPosition
    const fruit = new Fruit(position)

    this._fruits.set(fruit.id, fruit)
    this._course.occupyGridSquare(fruit)

    return fruit
  }

  removeFruit (fruit) {
    this._fruits.delete(fruit.id)
    this._course.removeObjectFromGrid(fruit)
  }

  get fruits () {
    return this._fruits
  }

  get length () {
    return this._fruits.size
  }
}

module.exports = FruitHandler
