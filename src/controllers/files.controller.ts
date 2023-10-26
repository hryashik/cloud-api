import { NextFunction, Request, Response } from "express";
import { CustomHttpError } from "../errors/customHttpError";
import FileService from "../services/files.service";
import { extname, join } from "node:path";
import { FileMulterType } from "../types/FileMulter";
import * as fs from "node:fs";
import archiver from "archiver";

interface IReqCreateFile extends Request {
   body: {
      type?: string;
      name?: string;
   };
}
interface IReqDeleteBody extends Request {
   body: {
      fileId: string;
   };
}
interface IReqUploadFiles extends Request {
   body: {
      files: string[];
   };
}
class FilesController {
   constructor(private filesService: FileService) {
      this.getFiles = this.getFiles.bind(this);
      this.create = this.create.bind(this);
      this.deleteFile = this.deleteFile.bind(this);
      this.uploadFiles = this.uploadFiles.bind(this);
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

   async create(req: IReqCreateFile, res: Response, next: NextFunction) {
      console.log(1)
      try {
         // JWT
         const userId = req.user?.id;
         if (!userId) throw new CustomHttpError("Unauthorized", 401);

         // QUERY PATH
         const path = req.query.path as string | undefined;
         const { name, type } = req.body;

         if (type === "dir") {
            if (!name) throw new CustomHttpError('Field "path" is require', 400);
            const dir = await this.filesService.createDir({ name, path, userId });
            res.json(dir).end();
         } else {
            const files = req.files as FileMulterType[];
            await this.filesService.saveFile({ files, path, userId });
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

   async uploadFiles(req: IReqUploadFiles, res: Response, next: NextFunction) {
      try {
         const userId = req.user?.id;
         if (!userId) throw new CustomHttpError("Unauthorized", 401);

         const files = req.body.files;
         await this.filesService.loadFiles({ userId, ids: files, res });
      } catch (error) {
         next(error);
      }
   }
}

export default FilesController;
