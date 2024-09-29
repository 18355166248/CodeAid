class calculator {
  constructor() {
    this.result = 0;
  }

  add(number) {
    this.result += number;
    return this;
  }

  subtract(number) {
    this.result -= number;
    return this;
    return this;
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

  getresult() {
    return this.result;
  }

  reset() {
    this.result = 0;
    return this;
  }
}

function add(a: number, b: number) {
  return a + b;
}
