const ObjectContainer = require('./object-container.js');
const Timer           = require('./timer.js');
const GameObject      = require('./game-object.js');
const Scene           = require('./scene.js');

module.exports = class Engine {
  constructor({ fps } = { fps: 30 }) {
    this.services = new ObjectContainer();
    this.services.registerInstance('engine', this);

    this.timer = new Timer(fps, () => this._update());
    this.scenes = [];
  }

  bootstrap() {
    this.services.assertConsistency();
  }

  /**
   * Create a new scene linked to this engine
   * @param {String} name 
   * @param {*} type 
   */
  createScene(name, type) {
    if (!this.services.isAsserted()) {
      throw new Error('You must boostrap engine before using create');
    }

    const obj = new type(name, this);
    if (!(obj instanceof Scene)) {
      throw new Error('You must inherit your object from Scene');
    }
    this.services.injectTo(obj);
    return obj;
  }

  /**
   * Create a new GameObject linked to this engine
   * @param {String} name 
   * @param {*} type 
   */
  createGameObject(name, type) {
    if (!this.services.isAsserted()) {
      throw new Error('You must boostrap engine before using create');
    }

    const go = new type(name, this.engine);
    if (!(go instanceof GameObject)) {
      throw new Error('You must inherit your object from GameObject');
    }

    this.engine.services.injectTo(go);
    return go;
  }

  /**
   * Add a scene to the rendering / updating process
   * @param {Scene} scene 
   */
  addScene(scene) {
    if (this.scenes.indexOf(scene) !== -1) {
      throw new Error(`Scene ${scene.name} is already registered`);
    }
    this.scenes.push(scene);
    return this;
  }

  /**
   * Remove a scene from this engine
   * @param {Scene} scene 
   * @returns {Boolean}
   */
  removeScene(scene) {
    const offset = this.scenes.indexOf(scene);
    if (offset !== -1) {
      this.scenes.splice(offset, 1);
      return true;
    }
    return false;
  }

  start() {
    this.timer.start();
  }

  stop() {
    this.timer.stop();
  }

  _update(delta) {
    this.scenes.forEach((scene) => {
      scene.update(delta);
    });
    this.scenes.forEach((scene) => {
      scene.render(this.renderer);
    });
  }
};