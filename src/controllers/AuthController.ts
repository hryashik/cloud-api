import { Request, Response } from "express";

export class AuthController {
   constructor() {}

   static signup(req: Request, res: Response) {
      console.log(req.body);
      res.end("Hello!");
   }
}
