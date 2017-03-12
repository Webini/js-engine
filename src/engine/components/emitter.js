const Component = require('../component.js');
const Emitter   = require('tiny-emitter');

module.exports = class EmitterComponent extends Component {
  constructor(object) {
    super('emitter', object);
    this.emitter = new Emitter();
  }

  on() {
    return this.emitter.on.apply(this.emitter, arguments);
  }

  once() {
    return this.emitter.once.apply(this.emitter, arguments);
  }

  off() {
    return this.emitter.off.apply(this.emitter, arguments);
  }

  emit() {
    return this.emitter.emit.apply(this.emitter, arguments);
  }

  /**
   * Broadcast an event to all the gameobject childs and ourself, it will add a last parameter
   * with the instance of the gameobject
   */
  broadcast() {
    const args = arguments;
    this.emit.apply(this.emit, args.concat(this.object));
    this.object.getGameObjects().forEach((object) => {
      object.emitter.broadcast.apply(object.emitter, args.concat([ object ]));
    });
  }
};