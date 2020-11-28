/**
 * @file Contains the Web API functions for players
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

// External Modules
import { Request, Response } from 'express';

// Internal Libraries
import log from "../lib/logger";
import mongo from "../lib/mongo";
import {parseQueryNums} from "../lib/tools";
import {numFields} from "./types";
import {hasRequiredPermissions} from "../lib/auth";

// Players API
import get from "./get";
import list from "./list";

/**
 * Web API to get player by Mongo ID
 *
 * @param req Incoming Request
 * @param res Outgoing Response
 */
export async function getFUTPlayerByID(req: Request, res: Response): Promise<Response> {

    // Verify the user has the correct permissions
    const hasRequiredPermission = hasRequiredPermissions(req.session.user, ["players.admin", "players.get"]);
    if (hasRequiredPermission === false) {
        return res.status(401).send({error: "Unauthorized", reason: "Missing permissions"});
    }

    const id = req.params.id;
    if (Boolean(id) === false) {
        return res.status(400).send({error: "Bad Request", reason: "Missing paramater: id"})
    }

    if (mongo.isValidID(id) === false) {
        const reason = `Invalid ID supplied: ID must be a single String of 12 bytes or a string of 24 hex characters`;
        return res.status(400).send({error: "Bad Request", reason});
    }

    try {
        const player = await get(id);
        if (player === null) {
            return res.status(404).send({error: "Not Found", reason: "Player does not exist for supplied id"});
        }
        return res.status(200).send(player);

    } catch(e) {
        log.error(`Failed to get player: ${id} - Reason: ${e.message}`, e);
        return res.status(500).send({error: "Internal Server Error"})
    };


}

/**
 * Web API to list players and allow for filtering, sorting and pagination
 *
 * @param req Incoming Request
 * @param res Outgoing Response
 */
export async function listFUTPlayers(req: Request, res: Response): Promise<Response> {

    // Verify the user has the correct permissions
    const hasRequiredPermission = hasRequiredPermissions(req.session.user, ["players.admin", "players.list"]);
    if (hasRequiredPermission === false) {
        return res.status(401).send({error: "Unauthorized", reason: "Missing permissions"});
    }

    const parsedQuery = parseQueryNums(req.query, ["limit", "skip", ...numFields]);
    try {
        const players = await list(parsedQuery);
        return res.status(200).send(players);

    } catch(e) {
        log.error(`Failed to list players - Reason: ${e.message}`, e);
        return res.status(500).send({error: "Internal Server Error"})
    };
}
