class GridSquare {
  constructor (id, location) {
    this._id = id
    this._location = location
    this._gameObjects = new Map()
  }

  get location () {
    return this._location
  }

  get occupied () {
    return this._gameObjects.size
  }

  get gameObjects () {
    return this._gameObjects.values()
  }

  getOtherGameObjects (gameObjectToExclude) {
    return Array.from(this.gameObjects).filter(gameObject => gameObject !== gameObjectToExclude)
  }

  addGameObject (gameObject) {
    this._gameObjects.set(gameObject.id, gameObject)
  }

  removeGameObject (gameObject) {
    this._gameObjects.delete(gameObject.id)
  }
}

module.exports = GridSquare
