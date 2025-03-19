import { Response } from "express";
import jwt from "jsonwebtoken";
import env from "./validateEnv";
import { Types } from "mongoose";

const genToken = (userId: Types.ObjectId, res: Response) => {
  try {
    const token = jwt.sign({ userId }, env.JWT_KEY, { expiresIn: "1d" });

    res.cookie("key", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    });
  } catch (error) {
    throw new Error("Unable to set the token");
  }
};

export default genToken;
