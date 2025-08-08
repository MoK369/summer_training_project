// @ts-check
import {userModelQuery} from "../models/users.model.js";
import {postsModelQuery} from "../models/posts.model.js";
import {commentsModelQuery} from "../models/comments.model.js";
import { connection } from "../db.connection.js";

async function syncModelsToDB() {
  try {
    const query = `${userModelQuery}${postsModelQuery}${commentsModelQuery}`;
    //console.log(query);
    await connection.query(query);

    console.log("Models Synced Successfully!");
    return true;
  } catch (error) {
    console.error("Failed Syncing Models!");
    console.error({ error });
    return false;
  }
}

export default syncModelsToDB;
