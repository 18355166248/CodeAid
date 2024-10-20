import { ToCoreFromIdeOrWebviewProtocol } from "../types/protocol.type";

export const WEBVIEW_TO_CORE_PASS_THROUGH: (keyof ToCoreFromIdeOrWebviewProtocol)[] =
  ["llm/streamChat", "abort", "insertCode"];
