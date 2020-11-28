/**
 * @file Console script to populdate the FUT Player database from a CSV file
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

// External Modules
import path from "path";
import {FUTSearch} from "@benhawley7/fut-search";

// Internal Libraries
import mongo from "../lib/mongo";
import log from "../lib/logger";
import {batchCreate} from "../players/create";

/**
 * Reads a CSV of FUT player data and inserts them into the Players DB collection
 */
async function populate(): Promise<void> {

    await mongo.init();

    const csvPath = path.join(__dirname, "../../../data/FIFA20.csv");
    log.info(`Attempt to populate FUT player DB from CSV: ${csvPath}`);
    const fut = new FUTSearch(csvPath);
    const players = await fut.listPlayers({});

    const batchSize = 1000;
    for (let i = 0; i < players.length; i += batchSize) {
        log.info(`Creating players ${i}:${i + batchSize}`);
        const result = await batchCreate(players.slice(i, i + batchSize));
        log.info(`Inserted ${result.insertedCount} records`);
        if (players.length < i + batchSize) {
            continue;
        }
    }

    log.info(`Completed population of FUT players. Closing Database Connection.`);
    mongo.getInstance().close();
}

populate();