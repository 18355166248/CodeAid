import vscode from "vscode";
import { IDE, IdeInfo } from "core";
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
}
