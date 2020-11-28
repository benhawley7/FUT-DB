/**
 * @file Creates a Mongo wrapper for easy access to the database
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

import {MongoClient} from "mongodb";
import log from "./logger";
import settings from "../../settings.json";

/**
 * Mongo Wrapper constructor input
 */
interface MongoConfig {
    user: string;
    password: string;
    host: string;
}

/**
 * Simple Mongo Wrapper class to return the connected database instance
 */
class Mongo {

    /**
     * Client to instantiate with host and user details to return a connection
     * @private
     */
    private client: MongoClient;

    /**
     * Our connected database client to return
     * @private
     */
    private db: MongoClient | null = null;

    /**
     * Host address of our mongo cluster
     * @private
     */
    private host: string | null = null;

    /**
     * Create a wrapper instance
     * @param config
     */
    constructor(config: MongoConfig) {
        const {user, password, host} = config;
        this.host = host;

        const uri = `mongodb+srv://${user}:${password}@${host}`;

        log.info(`Instantiating new mongo client for host: ${host}`);
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    /**
     * Initialise DB Wrapper class by connecting to the database
     */
    async init(): Promise<void> {
        log.info(`Attempting to connect to client at host: ${this.host}`)
        this.db = await this.client.connect().catch(e => {
            const errorMessage = `Failed to connect to Mongo DB - Reason: ${e.message}`;
            log.error(errorMessage);
            throw new Error(errorMessage);
        });
        log.info(`Successfully connected to client at host: ${this.host}`);
    }

    /**
     * Return our connected instance of the Mongo DB
     */
    getInstance(): MongoClient {
        if (this.db === null || this.db.isConnected() === false) {
            throw new Error(`Cannot get DB - Reason: DB is not connected`)
        }

        return this.db;
    }

    /**
     * Verify a string is a valid Mongo Document ID
     * @param id
     * @returns is valid
     */
    isValidID(id: string): boolean {
        const regex = new RegExp(/^[a-fA-F0-9]{24}$/);
        return regex.test(id);
    }
}

// Exports a singleton Mongo Wrapper class to return a connected database
export default new Mongo({
    user: settings.mongodb.user,
    password: settings.mongodb.password,
    host: settings.mongodb.host
});