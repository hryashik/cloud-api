import { NextFunction, Request, Response } from "express";
import JWTService from "../../services/jwt.service";
import UserSchema from "../../models/User";

const jwtService = new JWTService();

async function jwtGuard(req: Request, res: Response, next: NextFunction) {
   try {
      // check authorization header
      const { authorization } = req.headers;
      if (!authorization) {
         res.status(401).json({ error: "authorization field is required" });
         return;
      }

      // check available token
      const token = authorization.split(" ")[1];
      if (!token) {
         res.status(401).json({ error: "bad token" });
         return;
      }

      // verify token
      const value = await jwtService.verifyToken(token);
      if (value === null) {
         res.status(403).json({ error: "incorrect credentials in token" });
         return;
      }

      next();
   } catch (error) {
      next(error);
   }
}

export default jwtGuard;
