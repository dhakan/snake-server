const uuid = require('uuid/v4')

const settings = require('../utils/settings')
const NetworkHandler = require('../handler/NetworkHandler')
const Player = require('./Player')
const GameRound = require('./GameRound')

class Room {
  constructor (config) {
    this._id = uuid()
    this._players = new Map()

    this._unloadedCourses = config.courses
    this._networkHandler = config.networkHandler

    this._gameRound = null

    if (this._networkHandler) {
      this._attachNetworkListeners()
    }
  }

  get id () {
    return this._id
  }

  get state () {
    const state = {
      id: this.id,
      players: Array.from(this._players.values())
        .map(player => player.serialized)
    }

    return state
  }

  get randomCourse () {
    const randomIndex = Math.floor(Math.random() * this._unloadedCourses.length)
    const course = this._unloadedCourses[randomIndex]

    return course
  }

  _attachNetworkListeners () {
    this._networkHandler.on(NetworkHandler.events.CONNECT, this._onPlayerConnected.bind(this))
    this._networkHandler.on(NetworkHandler.events.CLIENT_LOADED, this._onClientLoaded.bind(this))
    this._networkHandler.on(NetworkHandler.events.DISCONNECT, this._onPlayerDisconnected.bind(this))
  }

  _emitRoomState () {
    this._networkHandler.emitRoomState(this.state)
  }

  _onPlayerConnected (id) {
    this._addPlayer(id)
  }

  _onClientLoaded (id) {
    this._players.get(id).ready = true

    // TODO don't emit this to clients currently playing, as the newly connected player has no position
    this._emitRoomState()

    this._handleCreateGameRound()
  }

  _handleCreateGameRound () {
    const numberOfPlayersRequiredAreEnough = (this._players.size >= settings.REQUIRED_NUMBER_OF_PLAYERS_FOR_GAME_ROUND)
    const allPlayersLoaded = (Array.from(this._players.values()).filter(player => player.ready).length === this._players.size)
    const gameRoundIsCountingDown = (this._gameRound && this._gameRound.isCountingDown)

    if (gameRoundIsCountingDown) {
      this._gameRound.stop()
    }

    const gameRoundIsNotRunning = !(this._gameRound && this._gameRound.isRunning)

    if (numberOfPlayersRequiredAreEnough && allPlayersLoaded && gameRoundIsNotRunning) {
      this._gameRound = new GameRound({
        networkHandler: this._networkHandler,
        players: this._players,
        course: this.randomCourse
      })
      this._gameRound.once(GameRound.events.WINNER_DECIDED, winners => {
        // TODO change this recursive behaviour(it never ends)
        this._handleCreateGameRound()
      })
    }
  }

  _onPlayerDisconnected (id) {
    this._removePlayer(id)

    const stopGameRound = this._players.size < settings.REQUIRED_NUMBER_OF_PLAYERS_FOR_GAME_ROUND && this._gameRound

    if (stopGameRound) {
      this._gameRound.stop()
    }

    this._emitRoomState()
  }

  _addPlayer (id) {
    const freeColors = Player.colors.filter(color => !color.occupied)
    const randomColor = freeColors[Math.floor(Math.random() * freeColors.length)]
    const player = new Player({
      id: id,
      color: randomColor
    })

    randomColor.occupied = true

    this._players.set(id, player)

    return player
  }

  _removePlayer (id) {
    const player = this._players.get(id)

    player.kill()

    player.color.occupied = false

    this._players.delete(id)
  }
}

module.exports = Room
