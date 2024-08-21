import vscode from "vscode";

export function getExtensionUri(): vscode.Uri {
  return vscode.extensions.getExtension("Swell.vscode")!.extensionUri;
}
