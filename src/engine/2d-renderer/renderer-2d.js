const RendererComponent   = require('./renderer-component.js');
const Camera2D            = require('./camera-2d.js');

module.exports = class Renderer2D {
  constructor({ camera } = { camera: {} }) {
    this.camera = new Camera2D(camera);
    this.go = [];

    this.sortMethod = function(a, b) {
      return (a.transform.absoluteZ - b.transform.absoluteZ);
    }; 
  }

  /**
   * Add a game object to the renderer
   * @param {GameObject} object 
   * @returns {Renderer2D}
   */
  addGameObject(object) {
    if (object.getComponentsByType(RendererComponent).length > 0 && 
        this.go.indexOf(object) === -1) {
      this.push(object);
    }
    return this;
  }

  /**
   * Remove a gameobject from the renderer
   * @param {GameObject} object 
   * @returns {Boolean}
   */
  removeGameObject(object) {
    const offset = this.go.indexOf(object);
    if (offset !== -1) {
      this.go.splice(offset, 1);
      return true;
    }
    return false;
  }

  render() {
    this.go = this.go
      .sort(this.sortMethod)
      .forEach((el) => {
        el.renderer.render(this.graphics);
      })
    ;
  }
};