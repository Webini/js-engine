const GameObject = require('./game-object.js');

class Scene extends GameObject {
  constructor(name, engine) {
    super();
    this.engine = engine;
    this.name = name;
  }

  onGameObjectAdded(go) {
    go.setScene(go);
  }

  onGameObjectRemoved(go) {
    go.setScene(null);
  }
}

module.exports = Scene; 