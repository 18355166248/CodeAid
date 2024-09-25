import { FromWebviewProtocol, Message } from "core";
import { v4 as uuidv4 } from "uuid";

export async function streamRequest<T extends keyof FromWebviewProtocol>(
  messageType: T,
  data: FromWebviewProtocol[T][0],
  cancelToken: AbortSignal,
): Promise<FromWebviewProtocol[T][1]> {
  const messageId = uuidv4();
  post(messageType, data, messageId);

  let buffer = "";
  let done = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let returnVal: any;

  function handler(e: { data: Message }) {
    if (e.data.messageId === messageId) {
      const responseData = e.data.data;
      console.log("🚀 ~ handler ~ responseData:", responseData);
    }
  }
  window.addEventListener("message", handler);

  return returnVal;
}

export function post<T extends keyof FromWebviewProtocol>(
  messageType: T,
  data: FromWebviewProtocol[T][0],
  messageId: string,
) {
  const msg: Message = {
    messageType,
    messageId,
    data,
  };
  window.vscode.postMessage(msg);
}
