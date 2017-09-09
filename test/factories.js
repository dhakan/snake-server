const Factory = require('rosie').Factory
const proxyquire = require('proxyquire')
const GameRoundMock = require('./mocks/GameRound')
const MockNetworkHandler = require('./mocks/NetworkHandler')
const Room = proxyquire('../src/objects/Room', {'./GameRound': GameRoundMock})

const RoomFactory = Factory.define('room', Room)
  .attr('courses', [])
  .attr('networkHandler', new MockNetworkHandler())

module.exports = {
  RoomFactory
}
