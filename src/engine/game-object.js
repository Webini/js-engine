const GameObjectContainer = require('./game-object-container.js');
const TransformComponent  = require('./components/transform.js');
const PositionComponent   = require('./components/position.js');
const EmitterComponent    = require('./components/emitter.js');
const Component           = require('./component.js');
const EVENTS              = require('./game-object-events.js');

const RESERVED_NAMES = [ 'engine', 'name', 'go', 'scene' ];

module.exports = class GameObject extends GameObjectContainer {
  constructor(name, engine) {
    super();
    this.engine = engine;
    this.name   = name;
    this.parent = null;
    this
      .addComponent(new PositionComponent(this))
      .addComponent(new EmitterComponent(this))
      .addComponent(new TransformComponent(this))
    ;
  }

  setScene(scene) {
    if (this.scene) {
      this.scene.emitter.emit(EVENTS.GAME_OBJECT_UNREGISTERED, this);
    }
    if (scene) {
      this.scene.emitter.emit(EVENTS.GAME_OBJECT_REGISTERED, this);
    }

    this.scene = scene;
    this.go.forEach((go) => {
      go.setScene(scene);
    });
    return this;
  }

  addComponent(component, name) {
    name = name || component.name;
    if (RESERVED_NAMES.indexOf(name) !== -1) {
      throw new Error(`${name} is a reserved name ( complete list : ${RESERVED_NAMES.join(', ')} )`);
    }

    if (this[name]) {
      throw new Error(`Component name ${name} already exists`);
    }

    this[name] = component;
    return this;
  }

  /**
   * @param {String|Component} component 
   * @returns {Boolean}
   */
  removeComponent(name) {
    if (this[name]) {
      delete this[name];
      return true;
    }
    return false;
  }

  /**
   * Retreive component of type @Type
   * @param {*} Type 
   * @return {Array}
   */
  getComponentsByType(Type) {
    const components = [];
    for (const key in this) {
      if (this[key] instanceof Type) {
        components.push(this[key]);
      }
    }
    return components;
  }

  onGameObjectAttached(go) {
    go.setParent(this);
    go.setScene(this.scene);
  }

  onGameObjectDetached(go) {
    go.setParent(null);
    go.setScene(null);
  }

  setParent(parent) {
    this.parent = parent;
    return this;
  }

  update(deltaTime) {
    for (const key in this) {
      if (this[key] instanceof Component) {
        this[key].update(deltaTime);
      }
    }

    this.go.forEach((go) => {
      go.update(deltaTime);
    });
  }
};