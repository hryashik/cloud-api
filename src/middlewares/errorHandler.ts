import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";

export function errorHandler(
   err: Error,
   req: Request,
   res: Response,
   next: NextFunction
) {
   if (err instanceof CustomError) {
      res.status(err.status)
         .json({ error: err.message})
         .end();
      return;
   }
   console.error(err.message);
   res.status(500).json({ msg: "Internal server error" });
}
