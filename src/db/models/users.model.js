// @ts-check
import * as validationFunctions from "../../utils/validation/validation_functions.js";
export const userModelQuery = `
CREATE TABLE IF NOT EXISTS users(
	id INT(11) PRIMARY KEY AUTO_INCREMENT NOT Null,
    name VARCHAR(150) Not Null,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    role ENUM('user','admin') DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
`;

export function userValidation(
  {
    name = undefined,
    email = undefined,
    password = undefined,
    role = undefined,
  }={},
  { validateOnlyIfNotUndifinedOrNull = false }={}
) {
  console.log({ email });
  console.log(validateOnlyIfNotUndifinedOrNull && email == null);

  if (name !== undefined) {
    if (!(validateOnlyIfNotUndifinedOrNull && name == null)) {
      validationFunctions.checkNameOrTitleLength(name);
    }
  }
  if (email !== undefined) {
    console.log("if condition email");
    if (!(validateOnlyIfNotUndifinedOrNull && email == null)) {
      validationFunctions.validateEmail(email);
    }
  }
  if (password !== undefined) {
    if (!(validateOnlyIfNotUndifinedOrNull && password == null)) {
      validationFunctions.checkPasswordLength(password);
    }
  }
  if (role !== undefined) {
    if (!(validateOnlyIfNotUndifinedOrNull && role == null)) {
      validationFunctions.validateRole(role);
    }
  }
}
