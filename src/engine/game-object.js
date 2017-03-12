const GameObjectContainer = require('./game-object-container.js');
const PositionComponent   = require('./component/position.js');
const Component           = require('./component.js');

const RESERVED_NAMES = [ 'engine', 'name', 'go', 'scene' ];

module.exports = class GameObject extends GameObjectContainer {
  constructor(name, engine) {
    super();
    this.engine = engine;
    this.name = name;
    this.addComponent(new PositionComponent(this));
  }

  setScene(scene) {
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