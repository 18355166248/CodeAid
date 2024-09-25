import vscode from "vscode";
import { v4 as uuid } from "uuid";
import { FromWebviewProtocol, Message } from "core";

export class VscodeWebviewProtocol {
  _webview?: vscode.Webview;
  _webviewListener?: vscode.Disposable;

  listeners = new Map<
    keyof FromWebviewProtocol,
    ((message: Message) => any)[]
  >();

  get webview(): vscode.Webview | undefined {
    return this._webview;
  }

  set webview(value: vscode.Webview) {
    this._webview = value;
    // 销毁之前的监听
    this._webviewListener?.dispose();

    this._webviewListener = this._webview.onDidReceiveMessage(async (e) => {
      if (!e.messageType || !e.messageId) {
        throw new Error(`Invalid webview protocol e: ${JSON.stringify(e)}`);
      }

      const respond = (message: any) =>
        this.send(e.messageType, message, e.messageId);

      // const handlers = this.

      if (e.messageId) {
        // 消息id
        console.log("收到消息", e);
      } else {
        console.log("收到通知", e);
      }
    });
  }

  send(messageType: string, data: any, messageId?: string) {
    const id = messageId ?? uuid();
    this._webview?.postMessage({
      messageType,
      data,
      messageId: id,
    });
    return id;
  }

  request(messageType: string, data?: any) {
    const messageId = uuid();
    return new Promise(async (resolve) => {
      let i = 0;
      while (!this.webview) {
        if (i > 10) {
          resolve(undefined);
          return;
        } else {
          await new Promise((resolve1) =>
            setTimeout(resolve1, i >= 5 ? 1000 : 500),
          );
          i++;
        }
      }

      // 假如说i不是0表示这个时候webview刚创建, 页面初始化需要时间, 延时
      if (i > 0) {
        await new Promise((resolve1) => setTimeout(resolve1, 2000));
      }
      this.send(messageType, data, messageId);
    });
  }
}
