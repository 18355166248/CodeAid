import {
  FromCoreProtocol,
  FromWebviewProtocol,
  Message,
  ToCoreProtocol,
} from "core";
import { InProcessMessenger } from "core/src/utils/messenger";
import { WEBVIEW_TO_CORE_PASS_THROUGH } from "core/src/protocol/passThrough";
import { VscodeWebviewProtocol } from "../webviewProtocol";

export class VscodeMessenger {
  constructor(
    private readonly messenger: InProcessMessenger<
      ToCoreProtocol,
      FromCoreProtocol
    >,
    private readonly webviewProtocol: VscodeWebviewProtocol,
  ) {
    WEBVIEW_TO_CORE_PASS_THROUGH.forEach((messageType) => {
      this.onWebView(messageType, async (msg) => {
        return await this.messenger.externalRequest(
          messageType,
          msg.data,
          msg.messageId,
        );
      });
    });
  }

  onWebView<T extends keyof FromWebviewProtocol>(
    messageType: T,
    handler: (
      message: Message<FromWebviewProtocol[T][0]>,
    ) => Promise<FromWebviewProtocol[T][1]> | FromWebviewProtocol[T][1],
  ) {
    this.webviewProtocol.on(messageType, handler);
  }
}
