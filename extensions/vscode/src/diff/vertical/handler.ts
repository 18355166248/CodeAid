import vscode from "vscode";
import { codeAidStreamingDiff } from "../../constant/vscode.context";

export class VerticalDiffHandler implements vscode.Disposable {
  constructor(
    private readonly editor: vscode.TextEditor,
    private readonly startLine: number,
    private readonly endLine: number,
  ) {}

  public get range(): vscode.Range {
    const startLine = Math.min(this.startLine, this.endLine);
    const endLine = Math.max(this.startLine, this.endLine);
    return new vscode.Range(startLine, 0, endLine, Number.MAX_SAFE_INTEGER);
  }

  disposables: vscode.Disposable[] = [];
  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }

  clear() {
    vscode.commands.executeCommand("setContext", codeAidStreamingDiff, false);
    this.dispose();
  }

  async run() {}
}
