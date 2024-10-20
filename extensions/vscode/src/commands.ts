import vscode from "vscode";
import { CodeAidGUIWebviewViewProvider } from "./Provider/CodeAidGUIWebviewViewProvider";
import { getConfigJsonPath } from "core/utils/paths";
import { VscodeIde } from "./ide/VscodeIde";
import { ContextMenuConfig } from "core";
import { myExtensionDisabledClearChat } from "./constant/vscode.context";
import { VerticalDiffManager } from "./diff/vertical/manager";

interface RegisterCommandsProps {
  context: vscode.ExtensionContext;
  sidebar: CodeAidGUIWebviewViewProvider;
  ide: VscodeIde;
  verticalDiffManager: VerticalDiffManager;
}
const commandsMap = ({
  context,
  sidebar,
  ide,
  verticalDiffManager,
}: RegisterCommandsProps) => {
  async function streamInlineEdit(
    prompt: keyof ContextMenuConfig,
    fallbackPrompt: string,
    onlyOneInsertion = false, // 是否只允许插入一个
  ) {
    const modelTitle = await sidebar.webviewProtocol.request(
      "getDefaultModelTitle",
    );
    await verticalDiffManager.streamEdit(
      fallbackPrompt,
      modelTitle,
      onlyOneInsertion,
    );
  }

  return {
    "codeAid.focusInput": () => {
      vscode.commands.executeCommand("codeAid.codeAidGUIView.focus");
    },
    "codeAid.openSetting": () => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "codeAid",
      );
    },
    "codeAid.cleatChat": () => {
      sidebar.sendMainUserSelect("codeAid.cleatChat");
    },
    "codeAid.fixCode": () => {
      // 修复此代码。如果它已经100%正确，只需重写代码即可。
      streamInlineEdit(
        "fix",
        "Fix this code. If it is already 100% correct, just rewrite the code.",
      );
    },
    "codeAid.commentCode": () => {
      // 分析代码添加内部行注释
      streamInlineEdit(
        "comment",
        "Write comments for this code. Do not change anything about the code itself.",
      );
    },
    "codeAid.writeDocstringForCode": async () => {
      // 给代码添加一个总的注释
      streamInlineEdit(
        "docstring",
        "Write a docstring for this code. Do not change anything about the code itself.",
        true,
      );
    },
    "codeAid.optimizeCode": () => {
      // 优化代码
      streamInlineEdit("optimize", "Optimize this code");
    },
    // 同意diff
    "codeAid.acceptVerticalDiffBlock": (filepath?: string, index?: number) => {
      verticalDiffManager.acceptRejectVerticalDiffBlock(true, filepath, index);
    },
    // 拒绝diff
    "codeAid.rejectVerticalDiffBlock": (filepath?: string, index?: number) => {
      verticalDiffManager.acceptRejectVerticalDiffBlock(false, filepath, index);
    },
    "codeAid.OpenConfigJson": () => {
      ide.openFile(getConfigJsonPath());
    },
    "codeAid.InsertCode": () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const snippet = new vscode.SnippetString(
          'console.log("Hello!");\nconsole.log("World!")',
        );
        editor.insertSnippet(snippet);
      }
    },
  };
};
export function registerCommands({
  context,
  sidebar,
  ide,
  verticalDiffManager,
}: RegisterCommandsProps) {
  for (const [command, callback] of Object.entries(
    commandsMap({ context, sidebar, ide, verticalDiffManager }),
  )) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, callback),
    );

    // 初始化上下文值为禁用状态
    vscode.commands.executeCommand(
      "setContext",
      myExtensionDisabledClearChat,
      false,
    );
  }
}
