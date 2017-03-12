const GameObject = require('./game-object.js');
const EVENTS     = require('./game-object-events.js');

class Scene extends GameObject {
  constructor(name, engine) {
    super(name, engine);
    this.emitter.on(EVENTS.GAME_OBJECT_REGISTERED, (go) => {
      engine.renderer.addGameObject(go);
    });

    this.emitter.on(EVENTS.GAME_OBJECT_UNREGISTERED, (go) => {
      engine.renderer.removeGameObject(go);
    });
  }

  onGameObjectAttached(go) {
    go.setScene(this);
  }

  onGameObjectDetached(go) {
    go.setScene(null);
  }

  static $getDependencies() {
    return {
      renderer: 'renderer'
    };
  }
}

module.exports = Scene; 