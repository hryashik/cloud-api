import { File } from "@prisma/client";
import { CustomRepositoryError } from "../errors/customRepositoryError";
import { FileRepositoryInterface, fileRepCreateFileDto } from "../interfaces/repositoryInterface";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomHttpError } from "../errors/customHttpError";

/* class FileRepository implements FileRepositoryInterface {
   private static instance: FileRepository;
   prisma: PrismaService = new PrismaService();
   constructor() {
      if (FileRepository.instance) {
         return FileRepository.instance;
      }
      FileRepository.instance = this;
   }
}

export default FileRepository;
 */