/**
 * @file Contains functions to create FUT Player in the database
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

import {OutfieldPlayer, GoalkeeperPlayer} from "./types";
import mongo from "../lib/mongo";
import log from "../lib/logger";
import { InsertWriteOpResult, InsertOneWriteOpResult } from "mongodb";

/**
 * Create a player record in the database
 * @param players
 * @returns inserted count
 */
export default async function create(player: OutfieldPlayer|GoalkeeperPlayer): Promise<InsertOneWriteOpResult<any>> {
    const db = mongo.getInstance().db("fut");
    const collection = db.collection("players");

    log.info(`Inserting player into the players collection`);
    const result = await collection.insertOne(player).catch(e => {
        const errorMessage = `Failed to insert player - reason: ${e.message}`;
        log.error(errorMessage);
        throw new Error(errorMessage);
    });
    return result;
}

/**
 * Create multiple player records in the database
 * @param players
 * @returns inserted count
 */
async function batchCreate(players: OutfieldPlayer[]|GoalkeeperPlayer[]): Promise<InsertWriteOpResult<any>> {
    const db = mongo.getInstance().db("fut");
    const collection = db.collection("players");

    log.info(`Inserting ${players.length} players into the players collection`);
    const result = await collection.insertMany(players).catch(e => {
        const errorMessage = `Failed to insert ${players.length} players - Reason: ${e.message}`;
        log.error(errorMessage);
        throw new Error(errorMessage);
    });
    return result;
}

export {
    create,
    batchCreate
};