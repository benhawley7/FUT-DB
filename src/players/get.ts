/**
 * @file Contains functions to get a FUT Player in the database
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

import mongo from "../lib/mongo";
import log from "../lib/logger";
import {ObjectId} from "mongodb";
import {OutfieldPlayer, GoalkeeperPlayer} from "./types";

/**
 * Get a player by our database ID
 * @param id the database ID of the player
 * @returns player object
 */
export default function getById(id: string): Promise<OutfieldPlayer|GoalkeeperPlayer|null> {
    log.info(`Finding player with id: ${id}`);
    const db = mongo.getInstance().db("fut");
    const collection = db.collection("players");
    return collection.findOne({_id: new ObjectId(id)});
}
