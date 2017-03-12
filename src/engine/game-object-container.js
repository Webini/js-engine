module.exports = class GameObjectContainer {
  constructor() {
    this.go = [];
  }

  /**
   * Retreive a gameobject registered in this instance and not childs
   * @param {String|GameObject} go 
   * @returns {null|GameObject}
   */
  findGameObject(go) {
    for (let i = 0, sz = this.go.length; i < sz; i++) {
      if (this.go[i] === go || this.go[i].name === go) {
        return this.go[i];
      }
    }

    return null;
  }

  /**
   * Find all game objects with type @Type
   * @param {*} Type 
   * @return {Array}
   */
  findGameObjectsByType(Type) {
    return this.go.filter((go) => {
      return (go instanceof Type);
    });
  }

  /**
   * @param {GameObject} go 
   * @returns {GameObjectContainer} 
   */
  attachGameObject(go) {
    if (this.findGameObject(go)) {
      throw new Error(`Game object named ${go.name} is already attached`);
    }
    this.go.push(go);

    if (this.onGameObjectAdded) {
      this.onGameObjectAdded(go);
    }

    return this;
  }

  /**
   * Detach a GameObject
   * @param {String|GameObject} go 
   * @returns {Boolean}
   */
  detachGameObject(go) {
    for (let i = 0, sz = this.go.length; i < sz; i++) {
      if (this.go[i] === go || this.go[i].name === go) {
        if (this.onGameObjectRemoved) {
          this.onGameObjectRemoved(this.go[i]);
        }
        this.go.splice(i, 1);
        return true;
      }
    }
    return false;
  } 

  /**
   * Retreive all root game objects
   * @returns {GameObject[]}
   */
  getGameObjects() {
    return this.go;
  }
};