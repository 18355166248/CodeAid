import vscode, { commands, languages, workspace } from "vscode";
import { CodeAidGUIWebviewViewProvider } from "../Provider/CodeAidGUIWebviewViewProvider";
import CodelensProvider from "../Provider/CodelensProvider ";
import { CodeLensNames } from "../constants/codeLens.const";
import { getNodeText } from "../utils/getNodeText";
import { registerCommands } from "../commands";

export class VscodeExtension {
  private sidebar;

  constructor(context: vscode.ExtensionContext) {
    // 左侧视图
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

    // 函数辅助按钮
    context.subscriptions.push(
      vscode.languages.registerCodeLensProvider(
        [
          { language: "typescriptreact", scheme: "file" },
          { language: "javascriptreact", scheme: "file" },
          { language: "typescript", scheme: "file" },
          { language: "javascript", scheme: "file" },
        ],
        new CodelensProvider(),
      ),
    );

    // 函数辅助按钮的点击事件绑定
    CodeLensNames.forEach((v) => {
      context.subscriptions.push(
        commands.registerCommand(v.command, async (uri, node) => {
          const editor = vscode.window.activeTextEditor;
          if (!editor) return;

          const code = getNodeText(editor.document, node);

          // 触发 codeAid 左侧菜单视图选中加载显示
          vscode.commands.executeCommand("codeAid.focusInput");

          // 延时发送消息给到左侧菜单视图的webview
          this.sidebar.sendMainUserSelect(v.command, code);
        }),
      );
    });

    // commands
    registerCommands({ context });
  }
}
