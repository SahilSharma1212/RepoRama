import * as t from "@babel/types";
import { Entity, Field, Relationship } from "../../types";
import { detectReference } from "./relationParser";
import { mapPrimitive } from "./utils";

export function parseSchemaObject(
    entityName: string,
    schema: t.ObjectExpression
): Entity {
    const fields: Field[] = [];
    const relationships: Relationship[] = [];

    for (const prop of schema.properties) {
        if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) continue;

        const name = prop.key.name;
        const value = prop.value;

        // Array
        if (t.isArrayExpression(value)) {
            const el = value.elements[0];
            if (el && t.isObjectExpression(el)) {
                const rel = detectReference(entityName, name, el, true);
                if (rel) {
                    relationships.push(rel);
                    continue;
                }
            }
            fields.push({ name, type: "array", isArray: true });
            continue;
        }

        // Object
        if (t.isObjectExpression(value)) {
            const rel = detectReference(entityName, name, value, false);
            if (rel) relationships.push(rel);
            else fields.push({ name, type: "embedded" });
            continue;
        }

        // Scalar
        if (t.isIdentifier(value)) {
            fields.push({ name, type: mapPrimitive(value.name) });
        }
    }

    return { name: entityName, fields, relationships };
}
