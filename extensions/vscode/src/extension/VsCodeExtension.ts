import vscode from "vscode";
import { CodeAidGUIWebviewViewProvider } from "../CodeAidGUIWebviewViewProvider";

export class VscodeExtension {
  private sidebar;

  constructor(context: vscode.ExtensionContext) {
    this.sidebar = new CodeAidGUIWebviewViewProvider(context);

    // Sidebar
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        "codeAid.codeAidGUIView",
        this.sidebar,
        {
          webviewOptions: {
            // 当这个选项设置为 true 时，即使 Webview 被隐藏，其内容和状态仍然会被保留。
            // 这意味着当用户再次显示该 Webview 时，它不需要完全重新加载内容，可以直接恢复到之前的状态，这样可以提高性能和用户体验。
            retainContextWhenHidden: true,
          },
        },
      ),
    );
  }
}
