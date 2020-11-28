/**
 * @file Contains basic authentication middleware to check an API key exists in our DB
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

import { Request, Response, NextFunction } from 'express';
import log from "../lib/logger";
import getByAccessToken from "../users/get";
import {BasicUser} from "../users/types";

// Extend the Express Request type to have the session attribute
declare global {  // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            session: {
                user: BasicUser
            }
        }
    }
}

/**
 * Check a supplied user satisfies a list of permissions
 * @param user
 * @param requiredPermissions
 * @param options if requires all is true, then the user MUST have all the permissions
 */
export function hasRequiredPermissions(user: BasicUser, requiredPermissions: string[] = [], options = {requiresAll: false}): boolean {
    if (Array.isArray(user.permissions) === false) {
        return false;
    }
    if (options.requiresAll) {
        return requiredPermissions.every(permission => user.permissions.includes(permission));
    }
    return requiredPermissions.some(permission => user.permissions.includes(permission));
}

/**
 * Validates a request has a Bearer Authentication token which matches an API user in our database
 *
 * @param req
 * @param res
 * @param next
 */
export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction): Promise<void|Response> {

    try {
        const authHeader = req.headers.authorization;

        // An authentication header is required to access this service.
        if (authHeader === undefined) {
            throw new Error("No authorization header provided");
        }

        const [type, token] = authHeader.split(" ");

        // We only accept Bearer authentication
        if (type !== "Bearer") {
            throw new Error("Authorization type is not bearer");
        }

        const user = await getByAccessToken(token);

        if (user === null) {
            throw new Error("No matching user for token in database");
        }

        req.session = { user };
        return next();

    } catch (e) {
        log.warn(`Failed to authenticate "${req.method}" request to "${req.path}" from IP "${req.ip}" - Reason ${e.message}`);
        return res.status(401).send({ error: "Unauthorized" });
    }
}
