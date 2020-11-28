/**
 * @file Contains types and constants relevant to the players
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

/**
 * List of Numeric Fields for Player Objects
 */
export const numFields = [
    "rating",
    "pace",
    "shooting",
    "passing",
    "dribbling",
    "defending",
    "physicality",
    "diving",
    "handling",
    "kicking",
    "reflexes",
    "speed",
    "positioning"
];

/**
 * Shared Player Properties between Outfield and Goalkeepers
 * @interface
 */
export interface Player {
    [key: string]: string | number;
    name: string;
    club: string;
    position: string;
    revision: string;
    league: string;
    rating: number;
}

/**
 * Main stats of an outfield player
 * @interface
 */
export interface OutfieldPlayer extends Player {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physicality: number;
}

/**
 * Main stats of a goalkeeper player
 * @interface
 */
export interface GoalkeeperPlayer extends Player {
    diving: number;
    handling: number;
    kicking: number;
    reflexes: number;
    speed: number;
    positioning: number;
}