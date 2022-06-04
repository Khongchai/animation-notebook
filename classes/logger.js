class Logger {
  logCount = 0;
  logLimit = 0;

  constructor({ logLimit }) {
    this.logLimit = logLimit;
  }

  logFor(num, whatever) {
    if (this.logCount === num) {
      return;
    }
    console.log(whatever);
    this.logCount++;
  }

  logFrom(num, whatever) {
    if (this.logCount >= num) {
      console.log(whatever);
    }
    this.logCount++;
  }

  logRange(begin, end, whatever) {
    if (begin <= this.logCount && this.logCount <= end) {
      console.log(whatever);
    }
    this.logCount++;
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
