/**
 * @file Contains common tools used in the project
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

/**
 * Parse number fields in a query string
 * @param query the request query object
 * @param numberFields the fields to convert to numbers
 * @returns parsed query object
 */
export function parseQueryNums(query: object, numberFields: string[]) {
    const parsedQuery: {[key:string]: any} = {};
    for (const [key, value] of Object.entries(query)) {
        if (numberFields.includes(key)) {
            if (typeof value === "object") {
                parsedQuery[key] = parseQueryNums(value, ["lt", "lte", "gt", "gte", "eq"]);
            } else {
                parsedQuery[key] = Number(value);
            }
        } else {
            parsedQuery[key] = value;
        }
    }
    return parsedQuery;
}