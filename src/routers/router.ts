import { Router } from "express";
import AuthController from "../controllers/AuthController";
import authSignupValidate from "../middlewares/authSignup";
import AuthService from "../services/AuthService";
import JWTService from "../services/jwtService";

const authService = new AuthService(new JWTService());
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post("/", authSignupValidate, authController.signup);

export default authRouter;
