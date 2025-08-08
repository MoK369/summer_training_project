// @ts-check
import { connection } from "../../db/db.connection.js";
import { commentValidation } from "../../db/models/comments.model.js";
import { CustomError } from "../../utils/custom_error.js";

export const createBulkOfComments = async (req, res, next) => {
  try {
    const bodyList = req.body;
    if (!Array.isArray(bodyList) || bodyList.length == 0) {
      throw new CustomError("missing array of comments");
    }

    const comments = bodyList.map((value) => {
      const { content = null, postId = null, userId = null } = value;
      commentValidation({ content, postId, userId });
      return {
        content,
        postId,
        userId,
      };
    });
    let values = ``;
    let parameters = [];
    for (let i = 0; i < comments.length; i++) {
      values = values.concat(`(NULL,?,?,?,NULL,NULL)`);
      parameters.push(Object.values(comments[i]));
      if (i != comments.length - 1) {
        values = values.concat(`,`);
      }
    }
    parameters = parameters.flat(1);
    console.log({ values });
    console.log({ parameters });

    const createBulkQuery = `
    INSERT INTO comments (id,content,postId,userId,createdAt,updatedAt) 
    VALUES 
    ${values};
    `;
    console.log({ createBulkQuery });
    const result = await connection.execute(createBulkQuery, parameters);
    res.status(201).json({ success: true, message: "comments created!" });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};
export const updateCommentById = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const { ownerUserId = null, content = null } = req.body || {};
    commentValidation({ userId: ownerUserId, content });

    const selectCommentQuery = `
    SELECT * from comments WHERE id=?;
    `;
    const findCommentResult = await connection.execute(selectCommentQuery, [
      commentId,
    ]);
    const comment = findCommentResult[0][0];
    console.log({ ownerUserId });
    console.log({ comment });

    if (comment.userId != ownerUserId) {
      throw new CustomError("Authorization Failed!", 403);
    }

    const updateQuery = `
    UPDATE comments SET content=? where id=?;
    `;
    const result = await connection.execute(updateQuery, [content, commentId]);
    res.json({ success: true, message: "comments updated!" });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};

export const searchForComments = async (req, res, next) => {
  try {
    let { word, pageSize = 2, page = 1 } = req.query;
    pageSize = Number(pageSize);
    page = Number(page);

    if (page <= 0) {
      throw new CustomError("page must be greator than 0");
    }
    if (pageSize <= 0) {
      throw new CustomError("pageSize must be greator than 0");
    }
    //@ts-ignore
    if (isNaN(page) || isNaN(pageSize)) {
      throw new CustomError("both page and pageSize must numbers");
    }
    const getCountQuery = `
    SELECT COUNT(id) as 'count' from comments WHERE content LIKE ?;
    `;
    const countResult = await connection.execute(getCountQuery, [`%${word}%`]);
    const count = countResult[0][0].count;
    const getCommentsQuery = `
    SELECT * from comments WHERE content LIKE ? LIMIT ? OFFSET ?;
    `;
    const offset = pageSize * page - 1;
    const comments = await connection.execute(getCommentsQuery, [
      `%${word}%`,
      pageSize,
      offset,
    ]);
    res.json({
      success: true,
      count,
      pageSize,
      currentPage: page,
      totalPages: Math.ceil(count / pageSize),
      comments: comments[0],
    });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};
export const getThreeRecentComments = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const getRecentCommentsQuery = `
    SELECT * from comments WHERE postId=? ORDER BY createdAt DESC LIMIT 3;
    `;
    const comments = await connection.execute(getRecentCommentsQuery, [postId]);
    res.json({ success: true, body: comments[0] });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};
export const getCommentDetails = async (req, res, next) => {
  try {
    const commentId = req.params.id;

    const getCommentDetailsQuery = `
    SELECT comments.id as 'id',comments.content as 'content', 
    users.id as 'user_id', users.name as 'user_name', users.email as 'user_email',
    posts.id as 'post_id', posts.title as 'post_title', posts.content as 'post_content'
    from comments 
    LEFT OUTER JOIN users ON comments.userId = users.id
    LEFT OUTER JOIN posts ON comments.postId = posts.id
    WHERE comments.id=?;
    `;
    const commentDetails = await connection.execute(getCommentDetailsQuery, [
      commentId,
    ]);
    const {
      user_id,
      user_name,
      user_email,
      post_id,
      post_title,
      post_content,
      ...comment
    } = commentDetails[0][0];
    console.log({ result: commentDetails[0] });

    res.json({
      success: true,
      body: {
        comment,
        user: {
          id: user_id,
          name: user_name,
          email: user_email,
        },
        post: {
          id: post_id,
          title: post_title,
          content: post_content,
        },
      },
    });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};
