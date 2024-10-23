import vscode from "vscode";

// 通常以 publisher.name 形式命名。 Swell-CodeAid.codeaide
export function getExtensionUri(): vscode.Uri {
  console.log(2222);
  console.log(vscode.extensions.getExtension("Swell-CodeAid.codeaide"));
  return vscode.extensions.getExtension("Swell-CodeAid.codeaide")!.extensionUri;
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
