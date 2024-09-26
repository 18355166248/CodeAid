async function* toAsyncIterable(
  nodeReadable: NodeJS.ReadableStream,
): AsyncGenerator<Uint8Array> {
  for await (const chunk of nodeReadable) {
    yield chunk as Uint8Array;
  }
}

export async function* streamResponse(
  response: Response,
): AsyncGenerator<string> {
  console.log("🚀 ~ response:", response);
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
