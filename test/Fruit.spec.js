const chai = require('chai')
const expect = chai.expect

const Grid = require('../src/objects/Grid')
const FruitHandler = require('../src/handler/FruitHandler')

function prepare () {
  const grid = new Grid()
  const fruitHandler = new FruitHandler(grid)

  return fruitHandler
}

describe('Fruit', () => {
  beforeEach(() => {
    this.fruitHandler = prepare()
    this.fruit = this.fruitHandler.spawnFruit()
  })

  describe('removeFruit', () => {
    it('should remove one fruit', () => {
      const count = this.fruitHandler.fruits.size

      expect(this.fruitHandler.fruits.size).to.deep.equal(count)

      this.fruitHandler.removeFruit(this.fruit)

      expect(this.fruitHandler.fruits.size).to.deep.equal(count - 1)
    })
  })
})
