const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect

const settings = require('../src/utils/settings')
const Room = require('../src/objects/Room')
const GameRound = require('../src/objects/GameRound')
const Player = require('../src/objects/Player')

describe('Room', () => {

  beforeEach(() => {
    settings.REQUIRED_NUMBER_OF_PLAYERS_FOR_GAME_ROUND = 2
    this.room = new Room()
  })

  describe('create game round', () => {
    it('should not create game round when there are not enough players', () => {
      this.room._handleCreateGameRound()

      expect(this.room._gameRound).to.equal(null)
    })

    it('should not create game round when there are not enough players loaded', () => {
      const player = this.room._addPlayer('test-id')

      this.room._addPlayer('test-id-2')

      player.ready = true

      this.room._handleCreateGameRound()

      expect(this.room._gameRound).to.equal(null)
    })

    it('should create game round when players are enough and loaded', () => {
      const player = this.room._addPlayer('test-id')
      const player2 = this.room._addPlayer('test-id-2')

      player.ready = true
      player2.ready = true

      this.room._handleCreateGameRound()

      expect(this.room._gameRound).to.not.equal(null)
    })
  })
})