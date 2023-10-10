import { NextFunction, Request, Response } from "express";

class FilesController {
   constructor() {
      this.getAllFiles.bind(this);
   }
   getAllFiles(req: Request, res: Response, next: NextFunction) {
      res.send("OK")
   }
}

export default FilesController;