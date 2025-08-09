// @ts-check
import { connection } from "../../db/db.connection.js";
import { postValidation } from "../../db/models/posts.model.js";
import { CustomError } from "../../utils/custom_error.js";
import { getCurrentTimestamp } from "../../utils/get_current_timestamp.js";

export const createPost = async (req, res, next) => {
  try {
    const { title = null, content = null, userId = null } = req.body || {};
    postValidation({ title, content, userId });
    const createPostQuery = `
        INSERT INTO posts (id,title,content,userId,createdAt,updatedAt,deletedAt) values (NULL,?,?,?,NULL,NULL,NULL)
        `;
    const result = await connection.execute(createPostQuery, [
      title,
      content,
      userId,
    ]);
    res.status(201).json({ success: true, message: "Post Created!" });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};
export const softDeletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const createPostQuery = `
        UPDATE posts SET deletedAt=? where id =?
        `;
    const result = await connection.execute(createPostQuery, [
      getCurrentTimestamp(),
      postId,
    ]);
    console.log({ result:result[0] });
    if (result[0].affectedRows == 0) {
      throw new CustomError("post not found!", 404);
    }
    res.json({ success: true, message: "Post Deleted!" });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};
export const getPostsWithCreatedUser = async (req, res, next) => {
  try {
    const selectQuery = `
    SELECT posts.id,posts.title, users.id as 'user_id',users.name as 'user_name', comments.id as 'comment_id',comments.content as 'comment_content'
    From posts 
    LEFT OUTER JOIN users ON posts.userId=users.id
    LEFT OUTER JOIN comments ON comments.postId=posts.id 
    where posts.deletedAt is NULL
     `;
    const result = await connection.execute(selectQuery);

    const postsMap = new Map();
    result[0].forEach((row) => {
      const postId = row.id;

      if (!postsMap.has(postId)) {
        postsMap.set(postId, {
          id: postId,
          title: row.title,
          user: {
            id: row.user_id,
            name: row.user_name,
          },
          comments: [],
        });
      }

      if (row.comment_id) {
        postsMap.get(postId).comments.push({
          id: row.comment_id,
          content: row.comment_content,
        });
      }
    });
    const formatedResult = Array.from(postsMap.values());
    res.json({ success: true, body: formatedResult });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};
export const getPostsWithCommentsCount = async (req, res, next) => {
  try {
    const selectQuery = `
    SELECT posts.id,posts.title, COUNT(comments.id) as 'commentsCount'
    From posts 
    LEFT OUTER JOIN comments ON comments.postId=posts.id 
    where posts.deletedAt is NULL
    GROUP By posts.id
     `;
    const result = await connection.execute(selectQuery);

    res.json({ success: true, body: result[0] });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};
