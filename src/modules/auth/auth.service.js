// @ts-check
import { connection } from "../../db/db.connection.js";
import bcrypt from "bcryptjs";
import { userValidation } from "../../db/models/users.model.js";
import { CustomError } from "../../utils/custom_error.js";

export const signUp = async (req, res, next) => {
  try {
    let {
      name = null,
      email = null,
      password = null,
      role = null,
    } = req.body || {};
    userValidation({ name, email, password, role });
    const query = `
  INSERT INTO users (id,name,email,password,role,createdAt,updatedAt) values(null,?,?,?,?,null,null)
  `;
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);
    await connection.execute(query, [name, email, password, role]);
    res.status(201).json({ success: true, message: "user created!" });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    let { email = null, password = null } = req.body || {};
    userValidation({ email, password });
    const selectUserWithEmailQuery = `
  SELECT * from users WHERE email=? LIMIT 1;
  `;
    // const salt = bcrypt.genSaltSync(10);
    const result = await connection.execute(selectUserWithEmailQuery, [email]);
    const user = result[0][0];
    console.log({ user });
    if (!user) {
      throw new CustomError("Invalid Email or Password");
    }

    const doPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doPasswordMatch) {
      throw new CustomError("Invalid Email or Password");
    }

    user.password = undefined;
    res.json({ success: true, message: "user signed in!", body: user });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};
