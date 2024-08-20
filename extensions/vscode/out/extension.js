"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/base.ts
function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
var init_base = __esm({
  "src/utils/base.ts"() {
    "use strict";
  }
});

// src/utils/vscode.ts
function getExtensionUri() {
  return import_vscode.default.extensions.getExtension("Continue.continue").extensionUri;
}
var import_vscode;
var init_vscode = __esm({
  "src/utils/vscode.ts"() {
    "use strict";
    import_vscode = __toESM(require("vscode"));
  }
});

// src/CodeAidGUIWebviewViewProvider.ts
var import_vscode2, CodeAidGUIWebviewViewProvider;
var init_CodeAidGUIWebviewViewProvider = __esm({
  "src/CodeAidGUIWebviewViewProvider.ts"() {
    "use strict";
    import_vscode2 = __toESM(require("vscode"));
    init_base();
    init_vscode();
    CodeAidGUIWebviewViewProvider = class {
      constructor(extensionContext) {
        this.extensionContext = extensionContext;
      }
      resolveWebviewView(webviewView, context, token) {
        webviewView.webview.html = this.getSidebarContent(
          this.extensionContext,
          webviewView
        );
      }
      getSidebarContent(context, panel) {
        const extensionUri = getExtensionUri();
        const nonce = getNonce();
        const isInDevelopmentMode = context?.extensionMode === import_vscode2.default.ExtensionMode.Development;
        let scriptUri;
        let styleMainUri;
        if (isInDevelopmentMode) {
          scriptUri = "http://localhost:5173/src/main.tsx";
          styleMainUri = "http://localhost:5173/src/index.css";
        } else {
          scriptUri = panel.webview.asWebviewUri(import_vscode2.default.Uri.joinPath(extensionUri, "gui/assets/index.js")).toString();
          styleMainUri = panel.webview.asWebviewUri(import_vscode2.default.Uri.joinPath(extensionUri, "gui/assets/index.css")).toString();
        }
        return `
    <!DOCTYPE html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CodeAid</title>

        ${isInDevelopmentMode ? `  <script type="module">
          import RefreshRuntime from "/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        </script>` : ""}

        <script type="module" src="/@vite/client"></script>
      </head>

      <body>
        <div id="root"></div>
            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
      </body>
    </html>
    `;
      }
    };
  }
});

// src/extension/VsCodeExtension.ts
var import_vscode4, VscodeExtension;
var init_VsCodeExtension = __esm({
  "src/extension/VsCodeExtension.ts"() {
    "use strict";
    import_vscode4 = __toESM(require("vscode"));
    init_CodeAidGUIWebviewViewProvider();
    VscodeExtension = class {
      sidebar;
      constructor(context) {
        this.sidebar = new CodeAidGUIWebviewViewProvider(context);
        context.subscriptions.push(
          import_vscode4.default.window.registerWebviewViewProvider(
            "codeAid.codeAidGUIView",
            this.sidebar,
            {
              webviewOptions: {
                // 当这个选项设置为 true 时，即使 Webview 被隐藏，其内容和状态仍然会被保留。
                // 这意味着当用户再次显示该 Webview 时，它不需要完全重新加载内容，可以直接恢复到之前的状态，这样可以提高性能和用户体验。
                retainContextWhenHidden: true
              }
            }
          )
        );
      }
    };
  }
});

// src/activation/activate.ts
var activate_exports = {};
__export(activate_exports, {
  activateExtension: () => activateExtension
});
async function activateExtension(context) {
  const vscodeExtension = new VscodeExtension(context);
}
var init_activate = __esm({
  "src/activation/activate.ts"() {
    "use strict";
    init_VsCodeExtension();
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
async function dynamicImportAndActivate(context) {
  const { activateExtension: activateExtension2 } = await Promise.resolve().then(() => (init_activate(), activate_exports));
  try {
    return activateExtension2(context);
  } catch (error) {
    console.log("\u{1F680} ~ dynamicImportAndActivate ~ error:", error);
  }
}
function activate(context) {
  return dynamicImportAndActivate(context);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
