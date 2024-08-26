export function processGptStreamDataToString(chunk: string) {
  // 根据实际的数据格式进行解析和处理
  let str = "";
  let lines = chunk.split("\n");
  lines = lines.filter((v) => v);
  lines.forEach((line) => {
    let data = { content: "" };
    try {
      if (line.startsWith("data:")) {
        const eventData = line.replace(/^data:\s*/, "");
        // 在这里可以进一步处理收到的事件数据
        if (eventData) {
          data = JSON.parse(eventData);
        }
      } else {
        data = JSON.parse(line);
      }
    } catch (error) {
      console.table({
        error,
        line,
      });
    }
    str += data.content;
  });
  return { str };
}

function processOllamaStreamDataToString(chunk: string) {
  const data = JSON.parse(chunk);
  return { str: data.message.content as string };
}

export const chatResponseFormatUtilList = {
  gpt: processGptStreamDataToString,
  llama: processOllamaStreamDataToString,
};
