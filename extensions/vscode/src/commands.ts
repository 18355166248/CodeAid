import vscode from "vscode";

interface RegisterCommandsProps {
  context: vscode.ExtensionContext;
}
const commandsMap = () => {
  return {
    "codeAid.focusInput": () => {
      vscode.commands.executeCommand("codeAid.codeAidGUIView.focus");
    },
  };
};
export function registerCommands({ context }: RegisterCommandsProps) {
  for (const [command, callback] of Object.entries(commandsMap())) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, callback),
    );
  }
}
