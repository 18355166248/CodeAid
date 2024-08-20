import vscode from "vscode";
import { VscodeExtension } from "../extension/VsCodeExtension";

export async function activateExtension(context: vscode.ExtensionContext) {
  const vscodeExtension = new VscodeExtension(context);
}
