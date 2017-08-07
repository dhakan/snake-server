const GameObject = require('./GameObject')

class BodyPart extends GameObject {
  constructor (position, type, player) {
    super(position)
    this._type = type
    this._player = player
  }

  get type () {
    return this._type
  }

  set type (value) {
    this._type = value
  }

  get player () {
    return this._player
  }
}

BodyPart.HEAD = 'head'
BodyPart.BODY = 'body'

module.exports = BodyPart
