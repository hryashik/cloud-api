import { CustomHttpError } from "../errors/customHttpError";
import { FileRepositoryInterface, fileRepCreateManyDto } from "../interfaces/repositoryInterface";
import { AuthServiceInterface, FileServiceInterface } from "../interfaces/servicesInterfaces";
import { FileMulterType } from "../types/FileMulter";
import { CreateDirDTO } from "../types/createDir.dto";
import { extname } from "node:path";
import fs from "node:fs/promises";
import { join } from "node:path";
import { User } from "@prisma/client";

class FileService implements FileServiceInterface {
   constructor(
      private fileRepository: FileRepositoryInterface,
      private userService: AuthServiceInterface
   ) {}

   async createDir({ path, name, userId }: CreateDirDTO) {
      if (path) {
         const parent = await this.fileRepository.findOneByPath(path);
         if (!parent) {
            throw new CustomHttpError("Incorrect data", 404);
         }

         const currentPath = `${path}/${name}`;
         const dir = await this.fileRepository.create({
            name,
            userId,
            path: currentPath,
            type: "dir",
            parentId: parent.id,
         });

         //create user dir
         const dirPath = join(process.cwd(), "uploads", userId, currentPath);
         await fs.mkdir(dirPath);

         return dir;
      } else {
         const currentPath = name;
         const dir = await this.fileRepository.create({
            name,
            userId,
            path: currentPath,
            type: "dir",
         });

         //create user dir
         const dirPath = join(process.cwd(), "uploads", userId, currentPath);
         await fs.mkdir(dirPath);
         return dir;
      }
   }

   async getAllFiles(userId: string) {
      const files = await this.fileRepository.findMany(userId);
      return files;
   }

   async deleteFile({ userId, fileId }: { userId: string; fileId: string }) {
      // find file
      const file = await this.fileRepository.findOneById(fileId);
      if (!file || file.userId !== userId) {
         throw new CustomHttpError("Incorrect data", 400);
      }

      await this.fileRepository.deleteMany(file.path);
      await fs.rm(join(process.cwd(), "uploads", file.userId, file.path), { recursive: true });

      // calculate new disk space
      const files = await this.getAllFiles(userId);
      let size = 0;
      files.forEach((file) => {
         size += file.size;
      });

      //update user
      await this.userService.updateUser(userId, { usedSpace: size });
   }

   async saveFile({
      files,
      path,
      userId,
   }: {
      files: FileMulterType[];
      path?: string;
      userId: string;
   }) {
      const dto: fileRepCreateManyDto[] = [];
      let parentId: string | undefined;

      if (path) {
         const parent = await this.fileRepository.findOneByPath(path);
         if (!parent) throw new CustomHttpError("Incorrect parent path", 400);
         parentId = parent.id;
      }

      // FIND USER
      const user = (await this.userService.getUserById(userId)) as User;
      let filesSize = 0;

      // FORMATING DATA FOR DTO
      files.forEach((el) => {
         const encodeFileName = encodeURI(el.originalname);
         const obj: fileRepCreateManyDto = {
            name: encodeFileName,
            path: path ? `${path}/${encodeFileName}` : encodeFileName,
            type: extname(el.originalname),
            userId,
            size: el.size,
            parentId,
         };
         filesSize += el.size;
         dto.push(obj);
      });

      // check available disk size
      if (user.diskSpace - user.usedSpace >= filesSize) {
         const data = await this.fileRepository.createMany(dto);

         //move files in user dir
         files.forEach(async (file) => {
            const encodeFileName = encodeURI(file.originalname);
            const oldFilePath = join(process.cwd(), "uploads", file.filename);
            const newFilePath = join(
               process.cwd(),
               "uploads",
               userId,
               path ? path : "",
               encodeFileName
            );
            await this.userService.updateUser(userId, { usedSpace: filesSize });
            await fs.rename(oldFilePath, newFilePath);
         });
      } else {
         throw new CustomHttpError("Not enough disk space", 403);
      }
   }
}
export default FileService;
