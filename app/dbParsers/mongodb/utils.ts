export function mapPrimitive(type: string): string {
    switch (type) {
        case "String":
            return "string";
        case "Number":
            return "number";
        case "Boolean":
            return "boolean";
        case "Date":
            return "date";
        default:
            return "unknown";
    }
}
