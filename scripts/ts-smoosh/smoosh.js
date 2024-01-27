// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const ts = require("typescript");
const fs = require("fs");
const path = require("path");

/**
 * Writes the result of smooshing to a file
 */
function smoosh(base) {
  const smooshedSrc = returnSmooshed(base);
  const outputFile = `./${base}.tsx`;
  fs.writeFileSync(outputFile, smooshedSrc);
}

const declDoesntExist = { typeAliases: [], declarations: [], imports: [] };

function returnSmooshed(base) {
  const dtsFile = `${base}.d.ts`;
  // TODO(btford): log a warning here?
  const decls = fs.existsSync(dtsFile) ? parseDts(dtsFile) : declDoesntExist;

  const jsFile = `${base}.js`;
  const enrichedJsNode = enrichJs(jsFile, decls);

  const outputFile = `${base}.tsx`;

  const resultFile = ts.createSourceFile(
    outputFile,
    "",
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TSX
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const smooshedSrc = printer.printNode(
    ts.EmitHint.Unspecified,
    enrichedJsNode,
    resultFile
  );

  return smooshedSrc;
}

function parseDts(dtsFile) {
  const parsed = ts.createSourceFile(
    dtsFile,
    fs.readFileSync(dtsFile, "utf8"),
    ts.ScriptTarget.Latest
  );

  // these are going on top
  const typeAliases = [];
  const declarations = {};
  const imports = [];

  const aggregateDecl = (statement) => {
    // console.log(statement);
    const kind = ts.SyntaxKind[statement.kind];

    if (kind === "TypeAliasDeclaration") {
      declarations[getIdentifierName(statement)] = statement.type;
      typeAliases.push(statement);
      return;
    }
    if (kind === "ImportDeclaration") {
      return console.log("import...");
    }

    if (kind === "FirstStatement") {
      return statement.declarationList.declarations.map(aggregateDecl);
    }

    if (!kind.endsWith("Declaration")) {
      const message = `Unexpected statement kind "${kind}" in type definition file "${dtsFile}"`;
      return console.warn(message);
    } else {
      declarations[getIdentifierName(statement)] = statement;
    }
  };

  parsed.statements.forEach(aggregateDecl);

  return { typeAliases, declarations, imports };
}

function enrichJs(jsFile, dts) {
  const parsed = ts.createSourceFile(
    jsFile,
    fs.readFileSync(jsFile, "utf8"),
    ts.ScriptTarget.Latest
  );

  const findSource = (node) => {

    let typeSource = null;

    // First, search for a jsdoc tag with the type, like:
    // @type {typeof import('./b').Noop}
    if (node.jsDoc) {
      const typeTag = node.jsDoc[0].tags.find(
        (tag) => tag.tagName.escapedText === "type"
      );
      if (typeTag) {
        const fileName =
          typeTag.typeExpression.type.argument.literal.text;
        const identifier =
          typeTag.typeExpression.type.qualifier.escapedText;
        const dir = path.dirname(jsFile);
        const fullPath = path.resolve(dir, fileName + ".d.ts");
        const importedDts = parseDts(fullPath);
        const importedType = importedDts.declarations[identifier];
        if (!importedType) {
          console.warn(
            `Could not find ${identifier} in ${fullPath} while trying to smoosh ${jsFile}`
          );
          return node;
        }
        typeSource = importedType;
      }
    }

    // Second, use the d.ts file with the same name as this file.
    if (!typeSource) {
      typeSource = dts.declarations[getIdentifierName(node)];
    }

    return typeSource;
  }

  const transformer = (context) => (rootNode) => {
    function visit(node) {
      const kind = ts.SyntaxKind[node.kind];
      if (kind.endsWith("Declaration")) {
        if (kind === "FunctionDeclaration") {
          const typeSource = findSource(node);
          if (typeSource) {
            return ts.factory.updateFunctionDeclaration(
              node,
              node.decorators,
              node.modifiers,
              node.asteriskToken,
              node.name,
              typeSource.typeParameters,
              typeSource.parameters,
              typeSource.type,
              node.body
            );
          }
          return node;
        } else if (kind === 'VariableDeclaration') {
          const typeSource = findSource(node);
          if (typeSource) {
            return ts.factory.updateVariableDeclaration(
              node,
              node.name,
              node.exclamationToken,
              typeSource.type,
              node.initializer
            );
          }
          return node;
        }

        return node;
      }

      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
  };

  return ts.transform(parsed, [transformer]).transformed[0];
}

function getIdentifierName(node) {
  return node.name.escapedText;
}

module.exports = {
  smoosh,
  returnSmooshed,
};
