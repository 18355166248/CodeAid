import * as vscode from "vscode";
import { VerticalDiffCodeLensProps } from "../../diff/vertical/manager";

export default class VerticalDiffCodelens implements vscode.CodeLensProvider {
  private _eventEmitter: vscode.EventEmitter<void> =
    new vscode.EventEmitter<void>();

  onDidChangeCodeLenses: vscode.Event<void> = this._eventEmitter.event;

  public refresh(): void {
    this._eventEmitter.fire();
  }

  constructor(
    private readonly filepathToCodeLens: Map<
      string,
      VerticalDiffCodeLensProps[]
    >,
  ) {}

  public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const filepath = document.uri.fsPath;
    const blocks = this.filepathToCodeLens.get(filepath);
    if (!blocks) return [];

    const codeLenses: vscode.CodeLens[] = [];

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const start = new vscode.Position(block.start, 0);
      const range = new vscode.Range(
        start,
        start.translate(block.numGreen + block.numRed),
      );
      codeLenses.push(
        new vscode.CodeLens(range, {
          title: "Accept",
          command: "codeAid.acceptVerticalDiffBlock",
          arguments: [filepath, i],
        }),
        new vscode.CodeLens(range, {
          title: "Reject",
          command: "codeAid.rejectVerticalDiffBlock",
          arguments: [filepath, i],
        }),
      );
    }
    return codeLenses;
  }
}
