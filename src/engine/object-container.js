module.exports = class ObjectContainer {
  constructor({ dependenciesMethod } = { dependenciesMethod: '$getDependencies'}) {
    this.retreiveDepMethod = dependenciesMethod;
    this.singletons = {
      container: this
    };

    this.objects = {
      container: ObjectContainer
    };

    this.asserted = false;
  }

  /**
   * @returns {Boolean}
   */
  isAsserted() {
    return this.asserted;
  }

  /**
   * Check if object is registered in this container
   * @param {String} name 
   */
  isRegistered(name) {
    return (this.objects[name] !== undefined);
  }

  /**
   * Register an object
   * @param {String} name 
   * @param {Object} value Instanciable method 
   */
  register(name, value) {
    if (this.isRegistered(name)) {
      throw new Error(`An object named ${name} is already registered`);
    }

    this.objects[name] = value;
    return this;
  }

  /**
   * Register an existing instance
   * @param {String} name 
   * @param {*} value 
   * @returns ObjectContainer
   */
  registerInstance(name, value) {
    if (this.isInstanciated(name)) {
      throw new Error(`An object name ${name} is already instanciated`);
    }

    this.singletons[name] = value;
    return this;
  }

  /**
   * Instanciate a new object
   * @param {*} type 
   * @param {String} registeredName if not set the object will not be registered
   */
  instanciate(type, registeredName) {
    const object = new (type)();
    
    if (registeredName) {
      this.registerInstance(registeredName, object);
    }

    return this.injectTo(object);
  }

  /**
   * Inject dependencies to an initialized instance
   * @param {*} object 
   */
  injectTo(object) {
    if (object[this.retreiveDepMethod]) {
      const dependencies = object[this.retreiveDepMethod]();
      for (const injectedName in dependencies) {
        const setterName = 'set' + injectedName.charAt(0).toUpperCase() + injectedName.substring(1);
        const objectName = dependencies[injectedName];
        if (object[setterName]) {
          object[setterName](this.get(objectName));
        } else {
          object[injectedName] = this.get(objectName);
        }
      }
    }
    return object;
  }

  /**
   * Check if the object is instanciated
   * @param {String} name 
   */
  isInstanciated(name) {
    return (this.singletons[name] !== undefined);
  }


  /**
   * Retreive an object
   * @param {String} name 
   */
  get(name) {
    if (this.singletons[name]) {
      return this.singletons[name];
    }

    if (!this.isRegistered(name)) {
      throw new Error(`Object named ${name} not found`);
    }

    return this.instanciate(this.objects[name], name);
  }

  /**
   * Assert objects dependencies
   */
  assertConsistency() {
    for (const key in this.objects) {
      const object = this.objects[key];
      if (!object[this.retreiveDepMethod]) {
        continue;
      }

      const dependencies = object[this.retreiveDepMethod]();
      for (const injectedName in dependencies) {
        const objectName = dependencies[injectedName];
        if (!this.isRegistered(objectName)) {
          throw new Error(`Unknow object named ${objectName}`);
        }
      }
    }
    this.asserted = true;
    return this;
  }
};