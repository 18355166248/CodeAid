import { message } from "antd";
import { FromWebviewProtocol, Message, ToWebviewProtocol } from "core";
import { v4 as uuidv4 } from "uuid";

export async function* streamRequest<T extends keyof FromWebviewProtocol>(
  messageType: T,
  data: FromWebviewProtocol[T][0],
  cancelToken: AbortSignal,
): FromWebviewProtocol[T][1] {
  const messageId = uuidv4();
  _postToIde(messageType, data, messageId);

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
    _postToIde("abort", undefined, messageId);
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

// 发送消息给vscode
function _postToIde(
  messageType: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
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

// 监听外部的消息并通过响应回馈给外部
// 比如说我发送消息告知webview 我想要默认model webview接收到消息后通过vscode.postmessage 告知我model的值
export function respond<T extends keyof ToWebviewProtocol>(
  messageType: T,
  data: ToWebviewProtocol[T][1],
  messageId: string,
) {
  if (typeof window.vscode === "undefined") {
    throw new Error("请在 vscode 中打开");
  }
  _postToIde(messageType, data, messageId);
}

export function post<T extends keyof FromWebviewProtocol>(
  messageType: T,
  data: FromWebviewProtocol[T][0],
  messageId?: string,
) {
  if (typeof window.vscode === "undefined") {
    throw new Error("请在 vscode 中打开");
  }
  const _messageId = messageId ?? uuidv4();
  _postToIde(messageType, data, _messageId);
}
