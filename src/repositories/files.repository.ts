import { File } from "@prisma/client";
import { CustomRepositoryError } from "../errors/customRepositoryError";
import {
   FileRepositoryInterface,
   fileRepCreateFileDto,
   fileRepCreateManyDto,
} from "../interfaces/repositoryInterface";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { updateFileDto } from "../types/updateFileDto";

async function deleteFileWithChildren(prisma: PrismaService, node: File) {
   const children = await prisma.file.findMany({
      where: {
         parent: {
            id: node.id,
         },
      },
   });

   for (const child of children) {
      await deleteFileWithChildren(prisma, child);
   }

   await prisma.file.delete({
      where: {
         id: node.id,
      },
   });
}

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

   async findOneById(unique: string): Promise<File | null> {
      try {
         const file = this.prisma.file.findUnique({ where: { id: unique } });
         return file;
      } catch (error) {
         console.error(error);
         throw new CustomRepositoryError("Some error with find file", 500);
      }
   }

   async create(dto: fileRepCreateFileDto) {
      try {
         const file = await this.prisma.file.create({
            data: { ...dto },
         });
         return file;
      } catch (error) {
         if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
            throw new CustomRepositoryError("Dir with this name is exist", 409);
         }
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
         const node = (await this.findOneByPath(path)) as File;
         const data = await deleteFileWithChildren(this.prisma, node);
      } catch (error) {
         console.error(error);
         throw new CustomRepositoryError("Delete many", 500);
      }
   }

   async createMany(args: fileRepCreateManyDto[]) {
      try {
         const files = await this.prisma.file.createMany({ data: args });
         return files;
      } catch (error) {
         if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
            throw new CustomRepositoryError("File with this name is exist", 409);
         }
         console.error(error);
         throw new CustomRepositoryError("Error with file repository", 500);
      }
   }

   async updateOne({
      data,
      fileId,
      userId,
   }: updateFileDto) {
      try {
         const file = await this.prisma.file.update({
            where: { id: fileId, userId },
            data: { ...data },
         });
         return file;
      } catch (error) {
         if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
            throw new CustomRepositoryError("Credentials is taken", 409);
         }
         throw new Error();
      }
   }
}

export default FileRepository;
