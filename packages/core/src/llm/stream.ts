async function* toAsyncIterable(
  nodeReadable: NodeJS.ReadableStream,
): AsyncGenerator<Uint8Array> {
  for await (const chunk of nodeReadable) {
    yield chunk as Uint8Array;
  }
}

/**
 * 异步生成器函数，用于流式传输响应内容。
 * @param response Response 对象，包含响应数据。
 * @returns 异步生成器，每次迭代返回一个字符串，包含响应内容的一部分。
 * @throws 如果响应状态码不是 200，则抛出错误，错误信息为响应体内容。
 * @throws 如果响应体为空，则抛出错误 "No response body returned."。
 */
export async function* streamResponse(
  response: Response,
): AsyncGenerator<string> {
  if (response.status !== 200) {
    throw new Error(await response.text());
  }

  if (!response.body) {
    throw new Error("No response body returned.");
  }

  // Get the major version of Node.js
  const nodeMajorVersion = parseInt(process.versions.node.split(".")[0], 10);

  if (nodeMajorVersion >= 20) {
    // Use the new API for Node 20 and above
    const stream = (ReadableStream as any).from(response.body);
    for await (const chunk of stream.pipeThrough(
      new TextDecoderStream("utf-8"),
    )) {
      yield chunk;
    }
  } else {
    // Fallback for Node versions below 20
    // Streaming with this method doesn't work as version 20+ does
    const decoder = new TextDecoder("utf-8");
    const nodeStream = response.body as unknown as NodeJS.ReadableStream;
    for await (const chunk of toAsyncIterable(nodeStream)) {
      yield decoder.decode(chunk, { stream: true });
    }
  }
}

/**
 * 解析数据行
 * @param line 待解析的数据行
 * @returns 解析后的数据对象
 * @throws 如果解析后的数据中包含错误信息，则抛出包含错误信息的错误
 * @throws 如果接收到的JSON格式有误，则抛出包含错误信息的错误
 */
function parseDataLine(line: string): any {
  const json = line.startsWith("data: ")
    ? line.slice("data: ".length)
    : line.slice("data:".length);

  try {
    const data = JSON.parse(json);
    if (data.error) {
      throw new Error(`Error streaming response: ${data.error}`);
    }

    return data;
  } catch (e) {
    throw new Error(`Malformed JSON sent from server: ${json}`);
  }
}

/**
 * 解析SSE（Server-Sent Events）中的一行数据。
 * @param line SSE数据流中的一行数据
 * @returns 包含解析结果的对象，包含两个属性：done（表示是否处理完毕）和data（解析得到的数据）
 */
function parseSseLine(line: string): { done: boolean; data: any } {
  if (line.startsWith("data: [DONE]")) {
    return { done: true, data: undefined };
  }
  if (line.startsWith("data:")) {
    return { done: false, data: parseDataLine(line) };
  }
  if (line.startsWith(": ping")) {
    return { done: true, data: undefined };
  }
  return { done: false, data: undefined };
}

/**
 * 异步生成器函数，用于流式处理 SSE（Server-Sent Events）响应。
 *
 * @param response 响应对象，用于从服务器接收 SSE 数据。
 * @returns 异步生成器，每次迭代生成一条解析后的 SSE 数据行，直到所有数据都被处理完毕。
 */
export async function* streamSse(response: Response): AsyncGenerator<any> {
  let buffer = "";
  for await (const value of streamResponse(response)) {
    buffer += value;

    let position: number;
    while ((position = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, position);
      buffer = buffer.slice(position + 1);

      const { done, data } = parseSseLine(line);
      if (done) {
        break;
      }
      if (data) {
        yield data;
      }
    }
  }

  if (buffer.length > 0) {
    const { done, data } = parseSseLine(buffer);
    if (!done && data) {
      yield data;
    }
  }
}
