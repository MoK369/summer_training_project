// @ts-check
import { CustomError } from "../../utils/custom_error.js";
import * as validationFunctions from "../../utils/validation/validation_functions.js";
export const postsModelQuery = `
CREATE TABLE IF NOT EXISTS posts(
	id INT(11) PRIMARY KEY AUTO_INCREMENT NOT Null,
    title VARCHAR(150) Not Null,
    content VARCHAR(300) NOT NULL,
    userId INT(11),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deletedAt TIMESTAMP NULL
);
`;

export function postValidation(
  { title = undefined, content = undefined, userId = undefined } = {},
  { validateOnlyIfNotUndifinedOrNull = false } = {}
) {
  if (title !== undefined) {
    if (!(validateOnlyIfNotUndifinedOrNull && title == null)) {
      validationFunctions.checkNameOrTitleLength(title);
    }
  }
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
}
