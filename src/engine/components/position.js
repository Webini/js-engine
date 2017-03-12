const Component = require('../component.js');

module.exports = class PositionComponent extends Component {
  constructor(object) {
    super('position', object);
    
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
};