const Factory = require('rosie').Factory
const proxyquire = require('proxyquire')
const GameRoundMock = require('./mocks/GameRound')
const MockNetworkHandler = require('./mocks/NetworkHandler')
const Room = proxyquire('../src/objects/Room', {'./GameRound': GameRoundMock})
const Course = require('../src/objects/Course')
const Player = require('../src/objects/Player')
const FruitHandler = require('../src/handler/FruitHandler')

const RoomFactory = Factory.define('room', Room)
  .attr('courses', [])
  .attr('networkHandler', new MockNetworkHandler())

const CourseFactory = Factory.define('course', Course)
  .attr('course', {
    settings: {
      backgroundColor: '#A5E9DB',
      world: {
        width: 400,
        height: 200
      },
      startPositions: []
    },
    walls: [{
      x: 50,
      y: 50
    }, {
      x: 100,
      y: 100
    }]
  })

const PlayerFactory = Factory.define('player', Player)
  .attr('course', CourseFactory.build())

const FruitHandlerFactory = Factory.define('fruitHandler', FruitHandler)
  .attr('course', CourseFactory.build())

module.exports = {
  RoomFactory,
  CourseFactory,
  PlayerFactory,
  FruitHandlerFactory
}
