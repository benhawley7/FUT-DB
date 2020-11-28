import {BasicUser, FullUser} from "./types";

import pick from "lodash.pick";

/**
 * Remove sensitive data from User Object
 * i.e. FullUser => BasicUser
 * @param user
 * @returns user with no sensitive info
 */
function convertFullToBasicUser(user: FullUser): BasicUser {
    return pick(user, ["type", "_id", "name", "permissions"])
}

export default {
    convertFullToBasicUser
}