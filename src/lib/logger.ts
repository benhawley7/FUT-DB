/**
 * @file Uses winston to define a common logger for the project
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

import winston from "winston";
const { combine, timestamp, printf, splat } = winston.format;

const formatPrintf = (o: winston.Logform.TransformableInfo): string => {
    return `${o.timestamp} [${o.level}]: ${o.message} ${o.meta ? JSON.stringify(o.meta) : ''}`;
};

const log = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: combine(
        timestamp(),
        splat(),
        printf(formatPrintf)
    )
});

export default log;