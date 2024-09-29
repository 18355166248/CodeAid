import vscode from "vscode";

export function getExtensionUri(): vscode.Uri {
  return vscode.extensions.getExtension("Swell.vscode")!.extensionUri;
}

// 在编辑器中打开文件
export function openEditor(filePath: string) {
  vscode.workspace.openTextDocument(filePath).then(async (doc) => {
    try {
      await vscode.window.showTextDocument(doc);
    } catch (error) {
      console.log("🚀 ~ vscode.workspace.openTextDocument ~ error:", error);
    }
  });
}
