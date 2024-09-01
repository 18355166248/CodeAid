import ts from "typescript";
import vscode from "vscode";

export function getNodeText(
  document: vscode.TextDocument,
  node: ts.Node,
): string {
  const start = node.getStart();
  const end = node.getEnd();
  return document.getText(
    new vscode.Range(document.positionAt(start), document.positionAt(end)),
  );
}
