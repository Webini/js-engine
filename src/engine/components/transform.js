const Component = require('../component.js');

module.exports = class Transform extends Component {
  constructor(object) {
    super('transform', object);

    this.position = { x: 0, y: 0, z: 0 };
  }

  set x(nx) {
    this.position.x = nx;
  }

  set y(ny) {
    this.position.y = ny;
  }

  set z(nz) {
    this.position.z = nz;
  }

  get z() {
    return this.position.z;
  }

  get y() {
    return this.position.y;
  }

  get x() {
    return this.position.x;
  }

  get absoluteZ() {
    if (this.object.parent) {
      return this.object.parent.transform.absoluteZ + this.position.z;
    }
    return this.position.z;
  }

  get absoluteX() {
    if (this.object.parent) {
      return this.object.parent.transform.absoluteX + this.position.z;
    }
    return this.position.x;
  }

  get absoluteY() {
    if (this.object.parent) {
      return this.object.parent.transform.absoluteY + this.position.z;
    }
    return this.position.y;
  }
};