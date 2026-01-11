import * as t from "@babel/types";
import { Relationship } from "../../types";

export function detectReference(
    from: string,
    field: string,
    obj: t.ObjectExpression,
    isArray: boolean
): Relationship | null {
    let hasObjectId = false;
    let ref: string | null = null;

    for (const prop of obj.properties) {
        if (!t.isObjectProperty(prop) || !t.isIdentifier(prop.key)) continue;

        if (prop.key.name === "type" && resolvesToObjectId(prop.value))
            hasObjectId = true;
        if (prop.key.name === "ref" && t.isStringLiteral(prop.value))
            ref = prop.value.value;
    }

    if (!hasObjectId || !ref) return null;

    return {
        from,
        to: ref,
        type: "REFERENCE",
        cardinality: isArray ? "ONE_TO_MANY" : "MANY_TO_ONE",
        field,
    };
}

function resolvesToObjectId(node: t.Node): boolean {
    if (t.isIdentifier(node)) return node.name === "ObjectId";
    if (t.isMemberExpression(node)) {
        if (t.isIdentifier(node.property))
            return node.property.name === "ObjectId";
        return resolvesToObjectId(node.object);
    }
    return false;
}
