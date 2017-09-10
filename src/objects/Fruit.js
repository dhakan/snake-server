const GameObject = require('./GameObject')

class Fruit extends GameObject {

  constructor (position) {
    super(position)
    this._value = this.generateRandomValue()
  }

  generateRandomValue () {
    const num = Math.random()

    if (num < 0.7)
      return 1
    else if (num < 0.8)
      return 2
    else if (num < 0.95)
      return 3
    else return 4
  }

  get value () {
    return this._value
  }

}

module.exports = Fruit
