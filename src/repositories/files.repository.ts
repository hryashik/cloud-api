import { File } from "@prisma/client";
import { CustomRepositoryError } from "../errors/customRepositoryError";
import { FileRepositoryInterface, fileRepCreateFileDto } from "../interfaces/repositoryInterface";
import { PrismaService } from "../prisma/prisma.service";

class FileRepository implements FileRepositoryInterface {
   private static instance: FileRepository;
   prisma: PrismaService = new PrismaService();
   constructor() {
      if (FileRepository.instance) {
         return FileRepository.instance;
      }
      FileRepository.instance = this;
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
         const currentPath = path === undefined ? name : `${path}/${name}`;
         const file = await this.prisma.file.create({ data: { name, type, userId, path: currentPath } });
         return file;
      } catch (error) {
         console.error(error);
         throw new CustomRepositoryError("Some error with create file", 500);
      }
   }

   async findMany(userId: string): Promise<File[]> {
      try {
         const files = await this.prisma.file.findMany({ where: { userId } });
         return files
      } catch (error) {
         console.error(error)
         throw new CustomRepositoryError("Find many files error", 500)
      }
   }
}

export default FileRepository;
