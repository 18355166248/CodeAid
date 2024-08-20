import vscode from "vscode";
import { getNonce } from "./utils/base";
import { getExtensionUri } from "./utils/vscode";

export class CodeAidGUIWebviewViewProvider
  implements vscode.WebviewViewProvider
{
  constructor(private readonly extensionContext: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken,
  ): Thenable<void> | void {
    webviewView.webview.html = this.getSidebarContent(
      this.extensionContext,
      webviewView,
    );
  }

  getSidebarContent(
    context: vscode.ExtensionContext | undefined,
    panel: vscode.WebviewView,
  ) {
    const extensionUri = getExtensionUri();
    const nonce = getNonce();

    const isInDevelopmentMode =
      context?.extensionMode === vscode.ExtensionMode.Development;

    let scriptUri: string;
    let styleMainUri: string;
    if (isInDevelopmentMode) {
      scriptUri = "http://localhost:5173/src/main.tsx";
      styleMainUri = "http://localhost:5173/src/index.css";
    } else {
      scriptUri = panel.webview
        .asWebviewUri(vscode.Uri.joinPath(extensionUri, "gui/assets/index.js"))
        .toString();
      styleMainUri = panel.webview
        .asWebviewUri(vscode.Uri.joinPath(extensionUri, "gui/assets/index.css"))
        .toString();
    }

    return `
    <!DOCTYPE html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CodeAid</title>

        ${
          isInDevelopmentMode
            ? `  <script type="module">
          import RefreshRuntime from "/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        </script>`
            : ""
        }

        <script type="module" src="/@vite/client"></script>
      </head>

      <body>
        <div id="root"></div>
            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
      </body>
    </html>
    `;
  }
}
