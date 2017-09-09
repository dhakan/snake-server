const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const factories = require('./factories')
const GameRoundMock = require('./mocks/GameRound')

const settings = require('../src/utils/settings')

describe('Room', () => {
  describe('create game round', () => {
    beforeEach(() => {
      settings.REQUIRED_NUMBER_OF_PLAYERS_FOR_GAME_ROUND = 2
      this.room = factories.RoomFactory.build('room')
    })

    // TODO fix this stupid solution, player color should not be an issue when testing the room
    afterEach(() => {
      for (const player of Array.from(this.room._players.values())) {
        player.color.occupied = false
      }
    })

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

    it('should stop game round counting down upon creating a new one', () => {
      this.room._gameRound = new GameRoundMock()

      sinon.spy(GameRoundMock.prototype, 'stop')

      const player = this.room._addPlayer('test-id')
      const player2 = this.room._addPlayer('test-id-2')

      player.ready = true
      player2.ready = true

      this.room._handleCreateGameRound()

      expect(GameRoundMock.prototype.stop.called).to.equal(true)
    })

    it('should not create a new game round when another one is running', () => {
      this.room._gameRound = new GameRoundMock()

      const player = this.room._addPlayer('test-id')
      const player2 = this.room._addPlayer('test-id-2')

      player.ready = true
      player2.ready = true

      const runningGameRound = this.room._gameRound

      this.room._handleCreateGameRound()

      expect(this.room._gameRound).to.equal(runningGameRound)
    })
  })
})
