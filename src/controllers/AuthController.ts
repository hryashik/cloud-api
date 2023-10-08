import { Request, Response } from "express";
import { signupDto } from "../types/signup.dto";
import { AuthService } from "../services/AuthService";

interface ISignupReq extends Request {
   body: signupDto;
}

export default class AuthController {
   private authService;
   constructor(authService: AuthService) {
      this.authService = authService;
      this.signup = this.signup.bind(this);
   }
   async signup(req: ISignupReq, res: Response) {
      try {
         const dto = req.body;
         const value = await this.authService.createUser(dto);
         res.send(value);
      } catch (error) {
         if (error instanceof Error) {
            res.status(409).json({});
         } else {
            res.status(500).json({ message: "Something error" });
         }
      }
   }
}
