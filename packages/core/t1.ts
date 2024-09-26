const chunks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

async function* test() {
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    yield {
      role: "assistant",
      content: chunk,
    };
  }
}

async function tt() {
  const g = test();
  let a = await g.next();
  while (!a.done) {
    console.log("🚀 ~ content:", a.value);
    a = await g.next();
  }
}

tt();
