import { NextFunction, Request, Response } from "express";
import { CustomHttpError } from "../errors/customHttpError";
import { MulterError } from "multer";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
   if (err instanceof CustomHttpError) {
      res.status(err.status).json({ error: err.message }).end();
      return;
   } else if (err instanceof MulterError) {
      switch (err.code) {
         case "LIMIT_FILE_SIZE":
            res.status(413).json({ error: err.code });
            break;
      }
      return
   }
   console.error(err.message);
   res.status(500).json({ msg: "Internal server error" });
}
