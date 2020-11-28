/**
 * @file Contains function to get a API user profile from their access token
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

import {BasicUser, FullUser} from "./types";
import mongo from "../lib/mongo";
import log from "../lib/logger";
import tools from "./tools";

/**
 * Find a user in the database with the supplied access token
 * @param token access token of the user
 */
async function getByToken(token: string): Promise<BasicUser|null> {
    // Open the database and the users collection
    const db = mongo.getInstance().db("fut");
    const collection = db.collection("users");

    const cursor = collection.find({
        // Tokens is an array - passing the single token value will find users with a tokens array containing it
        tokens: token
    });

    const result = await cursor.toArray();

    if (result.length === 0) {
        log.info(`Found no matching users for token: ${token}`);
        return null;
    }

    if (result.length > 1) {
        log.error(`Found ${result.length} matching users for token: ${token}`);
        return null;
    }

    const user: FullUser = result.pop();

    log.info(`Found user named "${user.name}" for token: ${token}`);

    // Strip out sensitive data
    return tools.convertFullToBasicUser(user);
}

export default getByToken;