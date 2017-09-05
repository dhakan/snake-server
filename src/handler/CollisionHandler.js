const BodyPart = require('../objects/BodyPart')

class CollisionHandler {
  constructor (grid) {
    this._grid = grid
  }

  playerWithGameObjectCollision (player) {
    const gridSquare = this._grid.getGridSquare(player.head.position)
    let collision = gridSquare && gridSquare.occupied && gridSquare.getOtherGameObjects(player.head)

    for (const gameObject of collision) {
      if (gameObject instanceof BodyPart) {
        collision = collision.filter(bodyPart => !bodyPart.player.idle)
      }
    }

    return collision
  }

  playerWithWorldBoundsCollision (player) {
    return player.isOutsideOfBounds
  }
}

module.exports = CollisionHandler
