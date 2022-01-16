class Metrics {
  constructor() {
    this.times = [];
  }

  getFps() {
    const now = performance.now();
    while (this.times.length > 0 && this.times[0] <= now - 1000) {
      this.times.shift();
    }
    this.times.push(now);
    const fps = this.times.length;
    return fps;
  }
}
