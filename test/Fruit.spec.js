const chai = require('chai')
const expect = chai.expect

const Fruit = require('../src/objects/Fruit')
const Grid = require('../src/objects/Grid')
const FruitHandler = require('../src/handler/FruitHandler')

function prepare() {

  const grid = new Grid()
  const fruitHandler = new FruitHandler(grid)

  return fruitHandler
}

describe('Fruit', () => {
  beforeEach(() => {
    this.fruitHandler = prepare()
  })

  describe('spawnFruit', () => {
    it('should create a new fruit in a random gridSquare', () => {

      this.fruitHandler.spawnFruit()

      expect(this.fruitHandler.fruits.size).to.deep.equal(1)
    })
  })

  describe('removeFruit', () => {
    it('should create a new fruit and then remove it', () => {

      const fruit = this.fruitHandler.spawnFruit()

      this.fruitHandler.removeFruit(fruit)

      expect(this.fruitHandler.fruits.size).to.deep.equal(0)
    })
  })
})