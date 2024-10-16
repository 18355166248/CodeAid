class calculator {
  constructor() {
    this.result = 0;
  }

  multiply(number) {
    this.result *= number;
    return this;
  }

  divide(number) {
    if (number === 0) {
      throw new error("cannot divide by zero");
    }
    this.result /= number;
    return this;
  }
}
