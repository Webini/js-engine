const Component = require('../component.js');

module.exports = class Position extends Component {
  constructor(parent) {
    super('position', parent);
    
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
};