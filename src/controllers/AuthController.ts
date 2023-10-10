import { NextFunction, Request, Response } from "express";
import { SignupDto } from "../types/signup.dto";
import { AuthService } from "../services/AuthService";
import { CustomHttpError } from "../errors/customHttpError";

interface ISignupReq extends Request {
   body: SignupDto;
}
interface ILoginReq extends Request {
   body: {
      email: string;
      password: string;
   };
}

export default class AuthController {
   private authService;

   constructor(authService: AuthService) {
      this.authService = authService;
      this.signup = this.signup.bind(this);
      this.login = this.login.bind(this);
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

   async login(req: ILoginReq, res: Response, next: NextFunction) {
      try {
         const dto = req.body;
         const token = await this.authService.checkCkredetials(dto);
         res.send({ token });
      } catch (error) {
         next(error);
      }
   }
}
