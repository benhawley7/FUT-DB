/**
 * @file Contains the data structures for API users
 * @package fut-db
 * @author Ben Hawley
 * @copyright Ben Hawley 2020
 */

/**
 * Basic user object with no sensitive information
 */
export interface BasicUser {
    type: "user";
    _id: string; // Database generated ID
    name: string; // Name of the user for displaying in the logs
    permissions: string[] // Access scopes for determining which endpoints they can access / operations they can perform
}

/**
 * Defines the structure of a full API user document
 * @interface
 */
export interface FullUser extends BasicUser {
    email: string;
    tokens: string[]; // array of API access tokens for this user
}
