const chai = require('chai')
const expect = chai.expect

const factories = require('./factories')

describe('Fruit', () => {
  beforeEach(() => {
    this.fruitHandler = factories.FruitHandlerFactory.build()
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
