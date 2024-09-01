import vscode from "vscode";
import { findFunctionsAndComponents } from "../utils/findFunctionsAndComponents";

export function setupInlineTips(context: vscode.ExtensionContext) {
  // const decorationType = vscode.window.createTextEditorDecorationType({
  //   after: {
  //     contentText: "🔍",
  //     backgroundColor: "yellow",
  //     margin: "0 0 0 5px",
  //   },
  // });

  const decorationType = vscode.window.createTextEditorDecorationType({
    before: {
      contentText: "",
      backgroundColor: "yellow",
      margin: "0 5px 0 0",
    },
  });

  console.log("🚀 ~ activate ~ context:", context);
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      console.log("editor.document.languageId", editor && editor.document);
      if (
        editor &&
        [
          "typescript",
          "javascript",
          "typescriptreact",
          "javascriptreact",
        ].includes(editor.document.languageId)
      ) {
        updateDecorations(editor);
      }
    }),
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && event.document === editor.document) {
        updateDecorations(editor);
      }
    }),
  );

  async function updateDecorations(editor: vscode.TextEditor) {
    const code = editor.document.getText();
    const items = findFunctionsAndComponents(code);
    console.log("🚀 ~ updateDecorations ~ items:", items);

    const decorations: vscode.DecorationOptions[] = items.map((item) => ({
      range: new vscode.Range(
        new vscode.Position(item.position.line, item.position.character),
        new vscode.Position(item.position.line, item.position.character),
      ),
      hoverMessage: `Click for details about ${item.kind} ${item.name}`,
      renderOptions: {
        before: {
          contentText: "[Comment] [Generate Test] [Explain Code]",
          backgroundColor: "#ff0",
          cursor: "pointer",
          border: "1px solid #000",
          padding: "2px",
        },
      },
    }));

    editor.setDecorations(decorationType, decorations);
  }
}
