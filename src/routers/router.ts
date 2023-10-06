import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import authSignupValidate from "../middlewares/authSignup";

const authRouter = Router();

authRouter.post("/", authSignupValidate, AuthController.signup);

export default authRouter;
