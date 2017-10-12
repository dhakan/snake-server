const chai = require('chai')
const expect = chai.expect

const settings = require('../src/utils/settings')
const BodyPart = require('../src/objects/BodyPart')
const factories = require('./factories')

function createPlayer (numberOfBodyParts = 2) {
  settings.NUMBER_OF_INITIAL_BODY_PARTS = numberOfBodyParts

  const player = factories.PlayerFactory.build()

  return player
}

describe('Player', () => {
  beforeEach(() => {
    this.position = {
      x: 50,
      y: 50
    }

    this.player = createPlayer()

    // TODO why is this needed here? Think about better architecture?
    this.player.initBody(this.position)
  })

  describe('move', () => {
    it('should not change position when no direction is set', () => {
      const position = this.player.head.position

      this.player.move()

      expect(position).to.deep.equal(this.player.head.position)
    })

    it('should change position when direction is set', () => {
      this.player.direction = settings.playerActions.UP

      const initialPosition = this.player.head.position

      this.player.move()

      expect(this.player.head.position.y).to.equal(initialPosition.y - settings.GRID_SIZE)
    })
  })

  describe('expand body', () => {
    it('should expand the number of body parts', () => {
      this.player = createPlayer(0)

      expect(this.player.bodyParts.length).to.equal(0)

      this.player.expandBody(this.position)

      expect(this.player.bodyParts.length).to.equal(1)
      expect(this.player.bodyParts[0].type).to.equal(BodyPart.HEAD)

      this.player.expandBody(this.position)

      expect(this.player.bodyParts[1].type).to.equal(BodyPart.BODY)
    })
  })

  describe('reduce body', () => {
    it('should reduce the number of body parts and eventually kill the player', () => {
      const initialBodyPartsLength = this.player.bodyParts.length

      this.player.reduceBody()

      expect(this.player.bodyParts.length).to.not.equal(initialBodyPartsLength)
      expect(this.player.bodyParts[0].type).to.equal(BodyPart.HEAD)
    })
  })

  describe('kill', () => {
    it('should kill the player and remove all contained body parts', () => {
      expect(this.player.bodyParts.length).to.equal(2)

      this.player.kill()

      expect(this.player.alive).to.equal(false)
      expect(this.player.bodyParts.length).to.equal(0)
    })
  })

  describe('body parts stashed to be built when moved', () => {
    beforeEach(() => {
      this.player.direction = settings.playerActions.UP
      this.player.bodyPartsYetToBeBuilt = 1
    })

    it('should expand the player body parts upon moving player', () => {
      expect(this.player.bodyParts.length).to.equal(2)
      expect(this.player._bodyPartsYetToBeBuilt).to.equal(1)

      this.player.move()

      expect(this.player.bodyParts.length).to.equal(3)
    })

    it('should expand the player with only one body part per move', () => {
      this.player.bodyPartsYetToBeBuilt = 1

      this.player.move()

      expect(this.player.bodyParts.length).to.equal(3)

      this.player.move()

      expect(this.player.bodyParts.length).to.equal(4)
    })
  })
})
