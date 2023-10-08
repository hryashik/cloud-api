import { Request, Response } from "express";
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
   async signup(req: ISignupReq, res: Response) {
      try {
         const dto = req.body;
         const value = await this.authService.createUser(dto);
         res.send(value);
      } catch (error) {
         if (error instanceof CustomError) {
            res.status(error.status).json({
               error: error.message,
               name: error.name,
            });
         } else {
            res.status(500).json({ message: "Something error" });
         }
      }
   }
}
