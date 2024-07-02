import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { db } from "../db/db.js";

const User = db.user;

const authenticateUser = async (reqBody) => {
  const user = await User.findOne({ username: reqBody.username });
  if (!user) {
    throw new Error("User not found");
  } else {
    const isPasswordValid = bcrypt.compareSync(reqBody.password, user.password);
    if (!isPasswordValid) {
      throw Error("Unauthorised");
    } else {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: 86400,
      });
      return {
        _id: user._id,
        username: user.username,
        accessToken: token,
      };
    }
  }
};

export default authenticateUser;
