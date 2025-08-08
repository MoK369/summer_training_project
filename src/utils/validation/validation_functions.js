// @ts-check
import { CustomError } from "../custom_error.js";

export function validateEmail(email) {
  console.log("inside validate email");
  
  if (!email) {
    throw new CustomError("ValidationError: missing email parameter");
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const result = regex.test(email);
  if (!result) {
    throw new CustomError("ValidationError: not a valid email format");
  }
}

export function checkPasswordLength(password) {
  if (!password || password.length <= 6) {
    throw new CustomError(
      "ValidationError: password must at least be 6 characters"
    );
  }
}

export function checkNameOrTitleLength(input) {
  if (!input || input.length < 3) {
    throw new CustomError(
      "ValidationError: name or title must be at least 2 characters"
    );
  }
}
export function checkContentLength(content) {
  if (!content || content.length <= 10) {
    throw new CustomError(
      "ValidationError: content must be at least 10 characters"
    );
  }
}

export function validateRole(role) {
  if (role != "user" && role != "admin") {
    throw new CustomError(
      "ValidationError: role must be either 'user' or 'admin' "
    );
  }
}
