import { File } from "@prisma/client";
import { CustomRepositoryError } from "../errors/customRepositoryError";
import { FileRepositoryInterface, fileRepCreateFileDto } from "../interfaces/repositoryInterface";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomHttpError } from "../errors/customHttpError";

class FileRepository implements FileRepositoryInterface {
   private static instance: FileRepository;
   prisma: PrismaService = new PrismaService();
   constructor() {
      if (FileRepository.instance) {
         return FileRepository.instance;
      }
      FileRepository.instance = this;
   }

   async findOneByPath(path: string) {
      try {
         const file = this.prisma.file.findUnique({ where: { path } });
         return file;
      } catch (error) {
         console.error(error);
         throw new CustomRepositoryError("Some error with find file", 500);
      }
   }

   async findOne(unique: string): Promise<File | null> {
      try {
         const file = this.prisma.file.findUnique({ where: { id: unique } });
         return file;
      } catch (error) {
         console.error(error);
         throw new CustomRepositoryError("Some error with find file", 500);
      }
   }

   async createFile({ name, type, userId, path }: fileRepCreateFileDto) {
      try {
         const file = await this.prisma.file.create({
            data: { name, type, userId, path },
         });
         return file;
      } catch (error) {
         console.error(error);
         throw new CustomRepositoryError("Some error with create file", 500);
      }
   }

   async findMany(userId: string): Promise<File[]> {
      try {
         const files = await this.prisma.file.findMany({ where: { userId } });
         return files;
      } catch (error) {
         console.error(error);
         throw new CustomRepositoryError("Find many files error", 500);
      }
   }

   async deleteMany(path: string): Promise<void> {
      try {
         const data = await this.prisma.file.deleteMany({ where: { path: { contains: path } } });
      } catch (error) {
         console.error(error);
         throw new CustomRepositoryError("Delete many", 500);
      }
   }
}

export default FileRepository;
