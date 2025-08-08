// @ts-check
import { CustomError } from "../../utils/custom_error.js";
import * as validationFunctions from "../../utils/validation/validation_functions.js";
export const commentsModelQuery = `
CREATE TABLE IF NOT EXISTS comments(
	id INT(11) PRIMARY KEY AUTO_INCREMENT NOT Null,
    content VARCHAR(300) NOT NULL,
    postId INT(11),
    FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    userId INT(11),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);`;

export function commentValidation(
  { content = undefined, postId = undefined, userId = undefined } = {},
  { validateOnlyIfNotUndifinedOrNull = false } = {}
) {
  console.log("Inside commentValidation");
  if (content !== undefined) {
    if (!(validateOnlyIfNotUndifinedOrNull && content == null)) {
      validationFunctions.checkContentLength(content);
    }
  }
  if (userId !== undefined) {
    if (!(validateOnlyIfNotUndifinedOrNull && userId == null)) {
      //@ts-ignore
      if (!userId || userId == "" || isNaN(userId)) {
        throw new CustomError(
          "ValidationError: userId must not be empty and must be a number"
        );
      }
    }
  }
  if (postId !== undefined) {
    if (!(validateOnlyIfNotUndifinedOrNull && postId == null)) {
      //@ts-ignore
      if (!postId || postId == "" || isNaN(postId)) {
        throw new CustomError(
          "ValidationError: postId must not be empty and must be a number"
        );
      }
    }
  }
}
