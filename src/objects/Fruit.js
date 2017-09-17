const GameObject = require('./GameObject')

class Fruit extends GameObject {
  constructor (position) {
    super(position)
    this._value = this.generateRandomValue()
  }

  generateRandomValue () {
    const num = Math.random()

    if (num < 0.33) {
      return 1
    } else if (num < 0.66) {
      return 2
    } else if (num < 1) {
      return 3
    }
  }

  get value () {
    return this._value
  }

  get serialized () {
    return {
      id: this._id,
      position: this.position,
      value: this.value
    }
  }
}

module.exports = Fruit
