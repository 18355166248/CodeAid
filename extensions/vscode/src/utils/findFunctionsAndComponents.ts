import * as ts from "typescript";

export interface FunctionsAndComponentsProps {
  name: string;
  kind: string;
  position: FunctionsAndComponentsPosition;
  node: ts.Node;
}

export interface FunctionsAndComponentsPosition {
  start: ts.LineAndCharacter;
  end: ts.LineAndCharacter;
}

export function findFunctionsAndComponents(sourceCode: string) {
  const sourceFile = ts.createSourceFile(
    "",
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
  );
  const functionsAndComponents: FunctionsAndComponentsProps[] = [];

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
        position: {
          start: sourceFile.getLineAndCharacterOfPosition(node.getStart()),
          end: sourceFile.getLineAndCharacterOfPosition(node.getEnd()),
        },
        node,
      });
    } else if (ts.isClassDeclaration(node) && node.name) {
      const name = node.name.getText();
      functionsAndComponents.push({
        name,
        kind: "component",
        position: {
          start: sourceFile.getLineAndCharacterOfPosition(node.getStart()),
          end: sourceFile.getLineAndCharacterOfPosition(node.getEnd()),
        },
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
            position: {
              start: sourceFile.getLineAndCharacterOfPosition(
                declaration.getStart(),
              ),
              end: sourceFile.getLineAndCharacterOfPosition(
                declaration.getEnd(),
              ),
            },
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
