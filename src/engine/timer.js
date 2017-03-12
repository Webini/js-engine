const SECOND = 1000;
const FPS    = 60;

module.exports = class Timer {
  constructor(callback) {
    this.interval = SECOND / FPS;
    this.lastUpdate = null;
    this.callback = callback;
    this.currentFrame = 0;
    this.currentMs = 0;
    this.fps = 0;
    this.started = false;

    this.requestAnimationFrame = (cb) => {
      return (requestAnimationFrame ||
              webkitRequestAnimationFrame ||
              mozRequestAnimationFrame ||
              msRequestAnimationFrame ||
              oRequestAnimationFrame ||
              (f => {
                setTimeout(() => f(this._getTime()), this.interval);
              }))(cb);
    };
  }

  _getTime() {
    return (performance.now() || (new Date()).getTime());
  }

  /**
   * Start the timer
   */
  start() {
    if (this.started) {
      return;
    }

    this.fps = 0;
    this.currentFrame = 0;
    this.currentMs = 0;
    this.lastUpdate = this._getTime();
    this.started = true;
    this.requestAnimationFrame((t) => this._update(t));
  }

  /**
   * Stop the timer
   */
  stop() {
    this.started = false;
    this.timer = null;
    this.fps = 0;
    this.currentFrame = 0;
    this.currentMs = 0;
    this.lastUpdate = null;
  }

  _update(now) {
    if (!this.started) {
      return;
    }

    const deltaMs = now - this.lastUpdate;
    const delta = deltaMs / this.interval;

    if (this.currentMs + deltaMs > SECOND) {
      this.currentMs = (this.currentMs + deltaMs) % SECOND;
      this.fps = this.currentFrame;
      this.currentFrame = 0;
    } else {
      this.currentMs += deltaMs;
      this.currentFrame++;
    }

    this.lastUpdate = now;

    let err = null;
    try {
      this.callback(delta);
    } catch(e) {
      err = e;
    }

    this.requestAnimationFrame((t) => this._update(t));

    if (err) {
      throw err;
    }
  }
};