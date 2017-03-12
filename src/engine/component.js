module.exports = class Component {
  /**
   * @param {String} name 
   * @param {GameObject} go 
   */
  constructor(name, object) {
    this.object = object;
    this.name = name;
  }

  update(deltaTime) {
  }
};