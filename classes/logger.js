class Logger {
  logCount = 0;
  logLimit = 0;

  constructor({ logLimit }) {
    this.logLimit = logLimit;
  }

  logOnce(whatever) {
    if (!this.logCount) {
      console.log(whatever);
      this.logCount = 1;
    }
  }

  clear() {
    this.logCount = 0;
    this.logLimit = 0;
  }

  setLogLimit(limit) {
    this.logLimit = limit;
  }

  log(whatever) {
    if (this.logCount < this.logLimit) {
      console.log(whatever);
      this.logCount++;
    }
  }
}
