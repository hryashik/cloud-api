import { Request, Response } from "express";
import { signupDto } from "../types/signup.dto";

interface ISignupReq extends Request {
   body: signupDto
}

export class AuthController {
   constructor() {}

   static signup(req: ISignupReq, res: Response) {
      const dto = req.body;
      res.send("Hello!");
   }
}