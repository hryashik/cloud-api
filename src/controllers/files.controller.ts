import { NextFunction, Request, Response } from "express";
import { CustomHttpError } from "../errors/customHttpError";

class FilesController {
   constructor() {
      this.getFiles.bind(this);
   }
   getFiles(req: Request, res: Response, next: NextFunction) {
      try {
         const { path } = req.query;
         if (!path) {
            throw new CustomHttpError("Path is not available", 403);
         }

         res.send("OK");
      } catch (error) {
         next(error)
      }
   }
}

export default FilesController;
