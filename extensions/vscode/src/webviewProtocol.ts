import vscode from "vscode";
import { v4 as uuid } from "uuid";

export class VscodeWebviewProtocol {
  _webview?: vscode.Webview;

  get webview(): vscode.Webview | undefined {
    return this._webview;
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

  request(messageType: string, data: any) {
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

      // TODO 不加不能触发 暂时先不删log
      console.log("data", data);
      this.send(messageType, data, messageId);
    });
  }
}
