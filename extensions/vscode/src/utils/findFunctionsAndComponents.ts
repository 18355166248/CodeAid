import * as ts from "typescript";

export function findFunctionsAndComponents(sourceCode: string) {
  const sourceFile = ts.createSourceFile(
    "",
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
  );
  const functionsAndComponents: {
    name: string;
    kind: string;
    position: ts.LineAndCharacter;
    node: ts.Node;
  }[] = [];

  function visit(node: ts.Node) {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node)
    ) {
      const name = node.name ? node.name.getText() : "<anonymous>";
      functionsAndComponents.push({
        name,
        kind: "function",
        position: sourceFile.getLineAndCharacterOfPosition(node.getStart()),
        node,
      });
    } else if (ts.isClassDeclaration(node) && node.name) {
      const name = node.name.getText();
      functionsAndComponents.push({
        name,
        kind: "component",
        position: sourceFile.getLineAndCharacterOfPosition(node.getStart()),
        node,
      });
    } else if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach((declaration) => {
        if (
          ts.isIdentifier(declaration.name) &&
          declaration.initializer &&
          (ts.isFunctionDeclaration(declaration.initializer) ||
            ts.isArrowFunction(declaration.initializer))
        ) {
          const name = declaration.name.getText();
          functionsAndComponents.push({
            name,
            kind: "function",
            position: sourceFile.getLineAndCharacterOfPosition(
              declaration.getStart(),
            ),
            node,
          });
        }
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return functionsAndComponents;
}
