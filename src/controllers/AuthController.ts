import { NextFunction, Request, Response } from "express";
import { signupDto } from "../types/signup.dto";
import { AuthService } from "../services/AuthService";
import { CustomError } from "../errors/customError";

interface ISignupReq extends Request {
   body: signupDto;
}

export default class AuthController {
   private authService;
   constructor(authService: AuthService) {
      this.authService = authService;
      this.signup = this.signup.bind(this);
   }
   async signup(req: ISignupReq, res: Response, next: NextFunction) {
      try {
         const dto = req.body;
         const data = await this.authService.createUser(dto);
         res.json({ token: data });
      } catch (error) {
         next(error);
      }
   }
}
