import { message } from "antd";
import { FromWebviewProtocol, Message } from "core";
import { v4 as uuidv4 } from "uuid";

export async function* streamRequest<T extends keyof FromWebviewProtocol>(
  messageType: T,
  data: FromWebviewProtocol[T][0],
  cancelToken: AbortSignal,
): FromWebviewProtocol[T][1] {
  const messageId = uuidv4();
  post(messageType, data, messageId);

  let buffer = "";
  let done = false;
  let index = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let returnVal: any;

  function handler(e: { data: Message }) {
    if (e.data.messageId === messageId) {
      const responseData = e.data.data;
      if (responseData.done) {
        window.removeEventListener("message", handler);
        returnVal = responseData;
        done = true;
      } else {
        buffer += responseData.content;
      }
    }
  }
  window.addEventListener("message", handler);

  // 监听触发取消信号 通知core端暂停请求
  cancelToken?.addEventListener("abort", () => {
    post("abort", undefined, messageId);
  });

  while (!done) {
    if (buffer.length > index) {
      const chunk = buffer.slice(index);
      index = buffer.length;
      yield chunk;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

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
  if (window.vscode) window.vscode.postMessage(msg);
  else {
    message.error("请在 vscode 中打开");
    throw new Error("请在 vscode 中打开");
  }
}
