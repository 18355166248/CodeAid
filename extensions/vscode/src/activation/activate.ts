import vscode from "vscode";
import { VscodeExtension } from "../extension/VsCodeExtension";
import { setupInlineTips } from "./inlineTips";

export async function activateExtension(context: vscode.ExtensionContext) {
  // setupInlineTips(context);

  const vscodeExtension = new VscodeExtension(context);
}
