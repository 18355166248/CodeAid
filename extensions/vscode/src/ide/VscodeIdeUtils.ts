import path from "node:path";
import vscode from "vscode";
import { openEditor } from "../utils/vscode";

export class VscodeIdeUtils {
  constructor() {}

  // 最大文件大小
  private MAX_BYTES = 100000;

  private _workspaceDirectories?: string[];
  getWorkspaceDirectories(): string[] {
    if (this._workspaceDirectories === undefined) {
      this._workspaceDirectories =
        vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) ||
        [];
    }
    return this._workspaceDirectories;
  }

  private _cachePath?: path.PlatformPath;
  get path(): path.PlatformPath {
    if (this._cachePath) return this._cachePath;

    // const sampleWorkspaceFolder =
    //   vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    // const isWindows = sampleWorkspaceFolder
    //   ? !sampleWorkspaceFolder.startsWith("/")
    //   : false;
    const isWindows = process.platform === "win32";

    this._cachePath = isWindows ? path.win32 : path.posix;
    return this._cachePath;
  }

  getAbsolutePath(filePath: string): string {
    const workspaceDirectories = this.getWorkspaceDirectories();
    if (!this.path.isAbsolute(filePath) && workspaceDirectories.length === 1) {
      return this.path.join(workspaceDirectories[0], filePath);
    }
    return filePath;
  }

  // 读取文件
  async readFile(filePath: string): Promise<string> {
    try {
      filePath = this.getAbsolutePath(filePath);
      const uri = vscode.Uri.file(filePath);
      const openTextDocument = vscode.workspace.textDocuments.find(
        (doc) => doc.uri.fsPath === uri.fsPath,
      );
      if (openTextDocument) {
        let text = openTextDocument.getText();
        text = text.substring(0, this.MAX_BYTES);
        return text;
      }

      const fileStat = await vscode.workspace.fs.stat(uri);
      if (fileStat.size > 10 * this.MAX_BYTES) {
        return "";
      }

      const bytes = await vscode.workspace.fs.readFile(uri);
      const sliceFileBytes = bytes.slice(0, this.MAX_BYTES);
      const contents = new TextDecoder().decode(sliceFileBytes);
      return contents;
    } catch (error) {}

    return "";
  }

  // 打开文件
  openFile(path: string) {
    return openEditor(path);
  }
}
