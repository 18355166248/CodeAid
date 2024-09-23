const continueMock = {
  model: "deepseek-coder",
  raw: true,
  keep_alive: 1800,
  options: {
    temperature: 0.01,
    num_predict: 1024,
    stop: [
      "<｜fim▁begin｜>",
      "<｜fim▁hole｜>",
      "<｜fim▁end｜>",
      "//",
      "<｜end▁of▁sentence｜>",
      "\n\n",
      "\r\n\r\n",
      "/src/",
      "#- coding: utf-8",
      "```",
      "\nfunction",
      "\nclass",
      "\nmodule",
      "\nexport",
      "\nimport",
    ],
    num_ctx: 4096,
  },
  prompt:
    '<｜fim▁begin｜>class Calculator {\n  constructor() {\n    this.result = 0;\n  }\n\n  add(number) {\n    this.result += number;\n    <｜fim▁hole｜>\n    return this;\n  }\n\n  subtract(number) {\n    this.result -= number;\n    return this;\n  }\n\n  multiply(number) {\n    this.result *= number;\n    return this;\n  }\n\n  divide(number) {\n    if (number === 0) {\n      throw new Error("Cannot divide by zero");\n    }\n    this.result /= number;\n    return this;\n  }\n\n  getResult() {\n    return this.result;<｜fim▁end｜>',
};

const codeAid = {
  prompt:
    '<｜fim▁begin｜>class calculator {\n  constructor() {\n    this.result = 0;\n  }\n\n  add(number) {\n    this.result += number;\n    return this;\n  }\n\n  subtract(number) {\n    this.result -= number;\n    return this;\n  }\n\n  multiply(number) {\n    this.result *= number;\n    <｜fim▁hole｜>\n    return this;\n  }\n\n  divide(number) {\n    if (number === 0) {\n      throw new error("cannot divide by zero");\n    }\n    this.result /= number;\n    return this;\n  }\n\n  getresult() {\n    return this.result;\n  }\n\n  reset() {\n    this.result = 0;\n    return this;\n  }\n}\n\nfunction add(a: number, b: number) {\n  return a + b;\n}\n<｜fim▁end｜>',
  model: "deepseek-coder",
  raw: true,
  keep_alive: 1800,
  options: {
    num_predict: 1024,
    num_ctx: 4096,
    temperature: 0.01,
    stop: [
      "<｜fim▁begin｜>",
      "<｜fim▁hole｜>",
      "<｜fim▁end｜>",
      "//",
      "<｜end▁of▁sentence｜>",
      "\n\n",
      "\r\n\r\n",
      "/src/",
      "#- coding: utf-8",
      "```",
      "\nfunction",
      "\nclass",
      "\nmodule",
      "\nexport",
      "\nimport",
    ],
  },
};
