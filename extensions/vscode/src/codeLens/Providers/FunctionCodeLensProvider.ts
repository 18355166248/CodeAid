import * as vscode from "vscode";
import { findFunctionsAndComponents } from "../../utils/findFunctionsAndComponents";
import { CodeLensNames } from "../../constants/codeLens.const";

export default class FunctionCodeLensProvider
  implements vscode.CodeLensProvider
{
  public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const code = document.getText();
    const items = findFunctionsAndComponents(code);
    const codeLenses: vscode.CodeLens[] = [];

    items.forEach((item) => {
      const line = item.position.start.line;

      const range = new vscode.Range(
        new vscode.Position(line, 0),
        new vscode.Position(line, 0),
      );
      const EnableCodelens = vscode.workspace.getConfiguration(
        "codeAid.EnableCodelens",
      );

      CodeLensNames.map((v) => {
        if (EnableCodelens[v.command] === true) {
          codeLenses.push(
            new vscode.CodeLens(range, {
              title: v.title,
              command: v.command,
              arguments: [
                document.uri,
                item.node,
                item.name,
                item.position,
                item.kind,
              ],
            }),
          );
        }
      });
    });

    return codeLenses;
  }
}
