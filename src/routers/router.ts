import { Router } from "express";
import AuthController from "../controllers/AuthController";
import authSignupValidate from "../middlewares/authSignup";
import AuthService from "../services/AuthService";

const authService = new AuthService();
const authController = new AuthController(authService)

const authRouter = Router();

authRouter.post("/", authSignupValidate, authController.signup);

export default authRouter;
