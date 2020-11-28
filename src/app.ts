/**
 * @file Connects to database and starts Express API server
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

// External Modules
import express, {Request, Response} from "express";
import bodyParser from "body-parser";

// Internal Libraries
import mongo from "./lib/mongo";
import log from "./lib/logger";
import settings from "../settings.json";
import {authenticationMiddleware} from "./lib/auth";
import {getFUTPlayerByID, listFUTPlayers} from "./players/web";

// Initialise connection to the Mongo Database and then create the API
mongo.init().then(() => {

    const app = express();

    app.use(bodyParser.json());

    // Log incoming request
    app.use((req, res, next) => {
        log.info(`"${req.method}" request to "${req.path}" from IP "${req.ip}"`);
        return next();
    });

    // Authenticate the incoming request
    // All requests with invalid auth will be rejected
    app.use(authenticationMiddleware);

    // Log authentication success
    app.use((req, res, next) => {
        log.info(`"${req.method}" request to "${req.path}" ` +
            `from IP "${req.ip}" authenticated as ${req.session.user.name}`);
        return next();
    });

    // Welcome!
    app.get("/", (req, res) => {
        return res.status(200).send({message: `Hello there, ${req.session.user.name}.`});
    });

    // The main API endpoints
    app.get("/fut/players", listFUTPlayers);
    app.get("/fut/players/:id", getFUTPlayerByID);

    // Fallback to not found
    const notFound = (req: Request, res: Response) => res.status(404).send({error: "Not Found"});
    app.get("*", notFound);
    app.post("*", notFound);
    app.put("*", notFound);
    app.delete("*", notFound);

    // Listen :)
    app.listen(settings.server.port, () => {
        log.info(`fut-db API - Listening on Port: ${settings.server.port}`);
    });
});
