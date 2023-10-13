import { NextFunction, Request, Response } from "express";
import { CustomHttpError } from "../errors/customHttpError";
import FilesService from "../services/files.service";
import { PrismaService } from "../prisma/prisma.service";

interface IRequest extends Request {
   files: Express.Multer.File[] | undefined;
}

class FilesController {
   constructor(private filesService: FilesService) {
      this.getFiles.bind(this);
      this.filesService;
   }

   async getFiles(req: Request, res: Response, next: NextFunction) {
      try {
         const { path } = req.query;
         if (!path) {
            throw new CustomHttpError("Path is not available", 403);
         }

         const prisma = new PrismaService();
         const data = await prisma.user.findUnique({
            where: {
               id: req.user?.id!!,
            },
            include: {
               files: {
                  include: {
                     user: {},
                  },
               },
            },
         });
         console.log(data?.files[0].user);
         res.send("OK");
      } catch (error) {
         next(error);
      }
   }

   async saveFiles(req: Request, res: Response, next: NextFunction) {
      try {
         const files = req.files;
         if (!files) {
            res.status(200).end();
            return;
         }
         if (Array.isArray(files)) {
            const prisma = new PrismaService();
            await prisma.file.create({
               data: { name: "first", type: "file", userId: req.user?.id!! },
            });
         }
         res.send("OK");
      } catch (error) {
         next(error);
      }
   }
}

export default FilesController;
