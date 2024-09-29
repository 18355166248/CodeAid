import vscode from "vscode";
import { CodeAidGUIWebviewViewProvider } from "./Provider/CodeAidGUIWebviewViewProvider";
import { getConfigJsonPath } from "core/utils/paths";
import { VscodeIde } from "./ide/VscodeIde";

interface RegisterCommandsProps {
  context: vscode.ExtensionContext;
  sidebar: CodeAidGUIWebviewViewProvider;
  ide: VscodeIde;
}
const commandsMap = ({ context, sidebar, ide }: RegisterCommandsProps) => {
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
    },
    "codeAid.OpenConfigJson": () => {
      ide.openFile(getConfigJsonPath());
    },
  };
};
export function registerCommands({
  context,
  sidebar,
  ide,
}: RegisterCommandsProps) {
  for (const [command, callback] of Object.entries(
    commandsMap({ context, sidebar, ide }),
  )) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, callback),
    );

    // 初始化上下文值为禁用状态
    vscode.commands.executeCommand(
      "setContext",
      "myExtension.disabledClearChat",
      false,
    );
  }
}
