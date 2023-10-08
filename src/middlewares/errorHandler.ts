import { NextFunction, Request, Response } from "express";

function errorHandler(
   err: Error,
   req: Request,
   res: Response,
   next: NextFunction
) {
   console.error(err);
   res.status(500).json({ msg: "Internal server  error" });
}
