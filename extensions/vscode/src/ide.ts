import vscode from "vscode";
import { IDE, IdeInfo } from "core";

export class VscodeIde implements IDE {
  constructor() {}

  async getIdeInfo(): Promise<IdeInfo> {
    return Promise.resolve({
      type: "vscode",
      name: vscode.env.appName,
    });
  }
}
