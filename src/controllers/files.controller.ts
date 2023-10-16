import { NextFunction, Request, Response } from "express";
import { CustomHttpError } from "../errors/customHttpError";
import FileService from "../services/files.service";
import { extname } from "node:path";
import { FileMulterType } from "../types/FileMulter";

interface IReqCreateFile extends Request {
   body: {
      type: "dir" | "file";
      name: string;
   };
}
interface IReqDeleteBody extends Request {
   body: {
      fileId: string;
   };
}
class FilesController {
   constructor(private filesService: FileService) {
      this.getFiles = this.getFiles.bind(this);
      this.create = this.create.bind(this);
      this.deleteFile = this.deleteFile.bind(this);
   }

   async getFiles(req: Request, res: Response, next: NextFunction) {
      try {
         // JWT
         const userId = req.user?.id;
         if (!userId) throw new CustomHttpError("Unauthorized", 401);

         const files = await this.filesService.getAllFiles(userId);
         res.json(files).end();
      } catch (error) {
         next(error);
      }
   }

   async saveFiles(req: Request, res: Response, next: NextFunction) {}

   async create(req: IReqCreateFile, res: Response, next: NextFunction) {
      try {
         // JWT
         const userId = req.user?.id;
         if (!userId) throw new CustomHttpError("Unauthorized", 401);

         // QUERY PATH
         const path = req.query.path as string | undefined;
         const { name, type } = req.body;

         if (type === "dir") {
            const dir = await this.filesService.createDir({ name, path, userId });
            res.json(dir).end();
         } else {
            const files = req.files as FileMulterType[];
            await this.filesService.saveFile({files, path, userId})
            res.send("OK");
         }
      } catch (error) {
         next(error);
      }
   }

   async deleteFile(req: IReqDeleteBody, res: Response, next: NextFunction) {
      try {
         const fileId = req.params.fileId;
         if (!fileId) throw new CustomHttpError("Bad request", 400);
         const userId = req.user?.id;
         if (!userId) throw new CustomHttpError("Unauthorized", 401);

         await this.filesService.deleteFile({ userId, fileId });
         res.send("OK");
      } catch (error) {
         next(error);
      }
   }
}

export default FilesController;
