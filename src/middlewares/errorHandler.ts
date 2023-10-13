import { NextFunction, Request, Response } from "express";
import { CustomHttpError } from "../errors/customHttpError";
import { MulterError } from "multer";
import { CustomRepositoryError } from "../errors/customRepositoryError";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
   // HTTP
   if (err instanceof CustomHttpError) {
      res.status(err.status).json({ error: err.message }).end();
      return;
      // MulterError
   } else if (err instanceof MulterError) {
      switch (err.code) {
         case "LIMIT_FILE_SIZE":
            res.status(413).json({ error: err.code });
            break;
      }
      return;
      // REPOSITORY
   } else if (err instanceof CustomRepositoryError) {
      if (err.status < 500) {
         res.status(err.status).json({ error: err.message }).end();
      } else {
         res.status(err.status).json({ error: "Internal server error" }).end();
      }
      return;
   }
   console.error(err.message);
   res.status(500).json({ msg: "Internal server error" });
}
