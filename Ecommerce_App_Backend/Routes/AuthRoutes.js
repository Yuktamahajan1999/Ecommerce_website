import express from "express";
import { signup, login } from "../Controllers/AuthController.js";
import { loginValidation, signupValidation } from "../Middlewares/Validation.js";

const router = express.Router();

// Public routes
router.post("/signup",signupValidation, signup);
router.post("/login",loginValidation, login);

export default router;
