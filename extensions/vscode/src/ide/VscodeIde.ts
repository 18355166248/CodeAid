import vscode from "vscode";
import { IDE, IdeInfo, RangeInFileWithContents } from "core";
import { VscodeIdeUtils } from "./VscodeIdeUtils";

export class VscodeIde implements IDE {
  ideUtils: VscodeIdeUtils;
  constructor() {
    this.ideUtils = new VscodeIdeUtils();
  }

  async getIdeInfo(): Promise<IdeInfo> {
    return Promise.resolve({
      type: "vscode",
      name: vscode.env.appName,
    });
  }

  async readFile(filePath: string): Promise<string> {
    return this.ideUtils.readFile(filePath);
  }

  async getWorkspaceDirs(): Promise<string[]> {
    return this.ideUtils.getWorkspaceDirectories();
  }

  async openFile(path: string) {
    this.ideUtils.openFile(path);
  }

  async writeFile({ filepath, range, contents }: RangeInFileWithContents) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const fsPath = editor.document.uri.fsPath;
    if (fsPath === filepath) {
      editor.edit((editBuilder) => {
        editBuilder.replace(
          new vscode.Range(
            new vscode.Position(range.start.line, range.start.character),
            new vscode.Position(range.end.line, range.end.character),
          ),
          contents,
        );
      });
    }
  }
}
