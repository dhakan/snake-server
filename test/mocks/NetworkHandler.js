const EventEmitter = require('events').EventEmitter

class NetworkHandler extends EventEmitter {
  _onConnection (socket) {
  }

  _onDisconnection (socket) {
  }

  _onPlayerAction (socket, payload) {
  }

  emitRoomState (roomState) {
  }

  emitGameRoundInitiated (payload) {
  }

  emitGameRoundCountdown (countdownValue) {
  }

  emitGameState (gameState) {
  }
}

module.exports = NetworkHandler
