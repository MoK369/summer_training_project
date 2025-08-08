// @ts-check
import { connection } from "../../db/db.connection.js";
import { userValidation } from "../../db/models/users.model.js";
import { CustomError } from "../../utils/custom_error.js";

export const updateUserInfo = async (req, res, next) => {
  try {
    const userId = req.params.id;
    let { name = null, email = null } = req.body;
    userValidation({ name, email }, { validateOnlyIfNotUndifinedOrNull: true });
    if (name == null && email == null) {
      throw new CustomError("Nothing to update", 400);
    }
    const selectUserQuery = `
    SELECT * from users where id=?
    `;
    const result = await connection.execute(selectUserQuery, [userId]);
    const user = result[0][0];
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    const query = `
      UPDATE users SET name= if(? is NOT NULL,?,?),
      email= if(? is NOT NULL,?,?)
      where id=?
      `;
    const updateResult = await connection.execute(query, [
      name,
      name,
      user.name,
      email,
      email,
      user.email,
      userId,
    ]);
    res.json({ success: true, message: "user updated!" });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};
export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const selectUserQuery = `
    SELECT id,name,email,createdAt,updatedAt from users where id=?
    `;
    const result = await connection.execute(selectUserQuery, [userId]);
    const user = result[0][0];
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    res.json({ success: true, message: "user found!", body: user });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};
