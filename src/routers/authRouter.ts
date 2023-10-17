import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import AuthService from "../services/auth.service";
import JWTService from "../services/jwt.service";
import authSignupValidate from "../middlewares/validations/authSignupValidate";
import authLoginValidate from "../middlewares/validations/authLoginValidate";
import UserRepository from "../repositories/user.repository";
import { PrismaClient } from "@prisma/client";
import jwtGuard from "../middlewares/guards/jwt.guard";

// SERVICES
const jwtService = new JWTService();
const userRepository = new UserRepository();
const authService = new AuthService(jwtService, userRepository);

// CONTROLLERS
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.get("/user", jwtGuard, authController.getUserByToken)
authRouter.patch("/user", authController.updateUser)
authRouter.post("/signup", authSignupValidate, authController.signup);
authRouter.post("/login", authLoginValidate, authController.login);

export default authRouter;
