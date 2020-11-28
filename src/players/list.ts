/**
 * @file Contains functions to list and query FUT Players in the database
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

import mongo from "../lib/mongo";
import log from "../lib/logger";
import {OutfieldPlayer, GoalkeeperPlayer} from "./types";

/**
 * Object to filter records by numeric properties
 * @interface
 */
interface FilterObject {
    lte?: number;
    gte?: number;
    eq?: number;
    lt?: number;
    gt?: number;
}

/**
 * Basic interface for the list parameters
 * @interface
 */
interface ListParams {
    [key: string]: string | number | FilterObject | undefined;
    limit?: number;
    skip?: number;
    sort?: string;
    order?: "asc"|"desc";
}

/**
 * List players with particular attributes
 * @param params for querying the listed players
 */
export default function list(params: ListParams = {}): Promise<OutfieldPlayer[]|GoalkeeperPlayer[]> {
    const db = mongo.getInstance().db("fut");
    const collection = db.collection("players");

    // Some basic pagination
    const limit: number = params.limit || 100;
    const skip: number = params.skip || 0;

    // We iterate through the params to construct the find query object
    const query: {[key: string]: any;} = {};
    for (const [key, value] of Object.entries(params)) {
        const ignoreKeys = ["limit", "skip", "sort", "order"];
        if (ignoreKeys.includes(key)) {
            continue;
        }

        if (query[key] === undefined) {
            query[key] = {};
        }

        if (typeof value === "object") {
            const validFilterKeys = ["lt", "gt", "eq", "lte", "gte"];
            for (const [objKey, objVal] of Object.entries(value)) {
                if (validFilterKeys.includes(objKey)) {
                    query[key][`$${objKey}`] = objVal;
                }
            }

        } else {
            query[key]["$eq"] = value;
        }
    }

    log.info(`Finding players with query: ${JSON.stringify(query)} skip: ${skip} and limit: ${limit}`);

    // Find the records which match the query
    const cursor = collection.find(query);

    // Optional sort by field
    if (params.sort !== undefined) {
        if (params.order === undefined) {
            params.order = "desc";
        }


        const sort: {[key: string]: 1|-1;} = {};
        sort[String(params.sort)] = params.order === "asc" ? 1 : -1;

        log.info(`Sorting query by key: ${params.sort} and order: ${params.order}`);

        cursor.sort(sort);
    }

    // Apply the pagination
    cursor.skip(skip).limit(limit);

    // toArray() returns a promise
    return cursor.toArray();
}