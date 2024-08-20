import * as vscode from "vscode";

async function dynamicImportAndActivate(context: vscode.ExtensionContext) {
  const { activateExtension } = await import("./activation/activate");

  try {
    return activateExtension(context);
  } catch (error) {
    console.log("🚀 ~ dynamicImportAndActivate ~ error:", error);
  }
}

export function activate(context: vscode.ExtensionContext) {
  return dynamicImportAndActivate(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
