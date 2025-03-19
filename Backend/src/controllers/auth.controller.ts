import { RequestHandler } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import genToken from "../utils/genToken";

interface signUpBody {
  username: string;
  email: string;
  password: string;
}

export const signup: RequestHandler<
  unknown,
  unknown,
  signUpBody,
  unknown
> = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      throw createHttpError(409, "Email is already taken ");
    }

    //encrypting the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating the new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //generating token for future auth
    genToken(newUser._id, res);

    res.status(201).json({
      success: true,
      id: newUser._id,
      user: { ...newUser.toObject(), password: null },
      message: "Account created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     //checking for user
//     const user = await User.findOne({ email });
//     if (!user) {
//       const error = new Error("Email is not associated with any account");
//       error.status = 401;
//       throw error;
//     }
//     //comparing the password
//     const checkPassword = await bcrypt.compare(password, user.password);
//     if (!checkPassword) {
//       const error = new Error("Wrong Password");
//       error.status = 401;
//       throw error;
//     }

//     genToken(res, user._id);
//     res.status(200).json({
//       success: true,
//       user: { ...user._doc, password: null },
//       message: "Logged in successfully.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const logout = async (req, res, next) => {
//   try {
//     //clearing the cookie
//     res.cookie("authToken", "", {
//       expires: new Date(0),
//       httpOnly: true,
//       sameSite: "strict",
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Logout successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const me = async (req, res, next) => {
//   try {
//     res.status(200).json({ user: req.user });
//   } catch (error) {
//     next(error);
//   }
// };
