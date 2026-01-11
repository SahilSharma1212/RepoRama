import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { Entity } from "../../types";
import { parseSchemaObject } from "./schemaParser";

export function parseMongooseSchema(code: string): Entity[] {
    const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript"],
    });

    const schemaMap = new Map<string, t.ObjectExpression>();
    const modelNames = new Map<string, string>();
    const entities: Entity[] = [];

    traverse(ast, {
        VariableDeclarator(path) {
            const init = path.node.init;
            if (
                t.isNewExpression(init) &&
                t.isObjectExpression(init.arguments[0])
            ) {
                const id = path.node.id;
                if (t.isIdentifier(id))
                    schemaMap.set(id.name, init.arguments[0]);
            }
        },

        CallExpression(path) {
            const callee = path.node.callee;
            if (
                t.isMemberExpression(callee) &&
                t.isIdentifier(callee.property, { name: "model" })
            ) {
                const [name, schema] = path.node.arguments;
                if (t.isStringLiteral(name) && t.isIdentifier(schema)) {
                    modelNames.set(schema.name, name.value);
                }
            }
        },
    });

    for (const [schemaVar, obj] of schemaMap) {
        const entityName = modelNames.get(schemaVar) || schemaVar;
        entities.push(parseSchemaObject(entityName, obj));
    }

    return entities;
}
