import { Router } from "express";
import AuthController from "../controllers/AuthController";
import authSignupValidate from "../middlewares/dto/authSignupValidate";
import AuthService from "../services/AuthService";
import JWTService from "../services/jwtService";
import authLoginValidate from "../middlewares/dto/authLoginValidate";
import UserRepository from "../repositories/user.repository";

// SERVICES
const jwtService = new JWTService();
const userRepository = new UserRepository();
const authService = new AuthService(jwtService, userRepository);

// CONTROLLERS
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post("/signup", authSignupValidate, authController.signup);
authRouter.post("/login", authLoginValidate, authController.login);

export default authRouter;
