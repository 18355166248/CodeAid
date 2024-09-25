import vscode from "vscode";
import { getNonce } from "../utils/base";
import { getExtensionUri } from "../utils/vscode";
import { VscodeWebviewProtocol } from "../webviewProtocol";

export class CodeAidGUIWebviewViewProvider
  implements vscode.WebviewViewProvider
{
  private _webview?: vscode.Webview;
  public webviewProtocol: VscodeWebviewProtocol;

  constructor(private readonly extensionContext: vscode.ExtensionContext) {
    this.webviewProtocol = new VscodeWebviewProtocol();
  }

  get webview() {
    return this._webview;
  }
  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken,
  ): Thenable<void> | void {
    this._webview = webviewView.webview;

    webviewView.webview.html = this.getSidebarContent(
      this.extensionContext,
      webviewView,
    );

    webviewView.webview.onDidReceiveMessage((e) => {
      switch (e.messageType) {
        case "chatMessageListLength":
          // 初始化上下文值为禁用状态
          vscode.commands.executeCommand(
            "setContext",
            "myExtension.disabledClearChat",
            e.data > 1,
          );
          return;
        // default:
        //   vscode.window.showErrorMessage("错误的消息类型");
      }
    });
  }

  getSidebarContent(
    context: vscode.ExtensionContext | undefined,
    panel: vscode.WebviewView,
  ) {
    const extensionUri = getExtensionUri();
    const nonce = getNonce();

    const isInDevelopmentMode =
      context?.extensionMode === vscode.ExtensionMode.Development;

    const localUrl = isInDevelopmentMode ? "http://localhost:5173" : "";
    // 本地联动需要使用本地端口，否则无法访问
    const vscMediaUrl = isInDevelopmentMode
      ? "http://localhost:5173"
      : panel.webview
          .asWebviewUri(vscode.Uri.joinPath(extensionUri, "gui"))
          .toString();

    let scriptUri: string;
    let styleMainUri: string;
    if (isInDevelopmentMode) {
      scriptUri = `${localUrl}/src/main.tsx`;
      styleMainUri = `${localUrl}/src/index.css`;
    } else {
      scriptUri = panel.webview
        .asWebviewUri(vscode.Uri.joinPath(extensionUri, "gui/assets/index.js"))
        .toString();
      styleMainUri = panel.webview
        .asWebviewUri(vscode.Uri.joinPath(extensionUri, "gui/assets/index.css"))
        .toString();
    }

    panel.webview.options = {
      // 允许在Webview中运行JavaScript代码。
      enableScripts: true,
      // 这个选项设置了Webview可以访问的本地资源根目录，从而限制Webview可以加载的本地文件
      localResourceRoots: [vscode.Uri.joinPath(extensionUri, "gui")],
      // 这个选项允许使用VS Code命令URI，例如vscode://my.extension/someCommand，从而能够在Webview内容中调用VS Code命令。
      enableCommandUris: true,
      // 这个选项用于定义Webview与VS Code扩展宿主之间的端口映射关系。
      portMapping: [
        {
          webviewPort: 65433,
          extensionHostPort: 65433,
        },
      ],
    };

    // 同步参数给到 webviewProtocol
    this.webviewProtocol.webview = panel.webview;

    return `
    <!DOCTYPE html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <script>window.vscode = acquireVsCodeApi();</script>

        <title>CodeAid</title>
        <link rel="stylesheet" href="https://at.alicdn.com/t/c/font_4663234_rbzc0ccc1de.css">
        <link href="${styleMainUri}" rel="stylesheet">

        ${
          isInDevelopmentMode
            ? `  <script type="module">
          import RefreshRuntime from "${localUrl}/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        </script>`
            : ""
        }

        ${
          isInDevelopmentMode
            ? `
              <script type="module" src="${localUrl}/@vite/client"></script>
              `
            : ""
        }
      </head>

      <body>
        <div id="root"></div>
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        <script>window.vscMediaUrl = "${vscMediaUrl}"</script>
      </body>
    </html>
    `;
  }

  // 发送消息
  sendMainUserSelect(messageType: string, input?: string) {
    this.webviewProtocol.request(messageType, input);
  }
}
