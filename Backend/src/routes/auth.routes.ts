import express from "express";
import * as authController from "../controllers/auth.controller";
import { signupSchema, loginSchema } from "../utils/zodSchema";
import authValidate from "../utils/authValidate";

const router = express.Router();

router.post("/signup", authValidate(signupSchema), authController.signup);
router.post("/login", authValidate(loginSchema), authController.login);
// router.post("/logout", logout);

// router.get("/me", protectRoute, me);

export default router;
