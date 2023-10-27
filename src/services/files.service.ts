import { CustomHttpError } from "../errors/customHttpError";
import { FileRepositoryInterface, fileRepCreateManyDto } from "../interfaces/repositoryInterface";
import { AuthServiceInterface, FileServiceInterface } from "../interfaces/servicesInterfaces";
import { FileMulterType } from "../types/FileMulter";
import { CreateDirDTO } from "../types/createDir.dto";
import { extname } from "node:path";
import fs from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { join } from "node:path";
import { User } from "@prisma/client";
import { Response } from "express";
import archiver from "archiver";
import { getFileByIdDto } from "../types/getFileById.dto";
import { updateFileDto } from "../types/updateFileDto";

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
         const encodeFileName = decodeURI(el.originalname);
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
            const encodeFileName = decodeURI(file.originalname);
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

   async loadFiles({ userId, res, ids }: { ids: string[]; userId: string; res: Response }) {
      const files = (await this.getAllFiles(userId)).filter((file) => ids.includes(file.id));

      const archive = archiver("zip", { zlib: { level: 9 } });
      res.type("zip");

      files.forEach((file) => {
         const filePath = join(process.cwd(), "uploads", userId, file.path);
         if (file.type === "dir") {
            archive.directory(filePath, file.name);
         } else {
            archive.file(filePath, { name: file.name });
         }
      });
      archive.pipe(res);
      archive.finalize().then(() => res.end());
   }

   async getFile({ userId, fileId, res }: getFileByIdDto) {
      const file = await this.fileRepository.findOneById(fileId);
      if (!file || file.userId !== userId) throw new CustomHttpError("Have no access to file", 403);

      if (file.type === ".json" || file.type === ".txt") {
         const localFilePath = join(process.cwd(), "uploads", userId, file.path);
         const readStream = createReadStream(localFilePath);
         readStream.pipe(res);
         readStream.on("end", () => readStream.close());
      }
   }

   async updateFile({ data, userId, fileId }: updateFileDto) {
      const file = await this.fileRepository.updateOne({ data, fileId, userId });
   }

   async updateContentFile({
      fileId,
      userId,
      content,
   }: {
      userId: string;
      fileId: string;
      content: string;
   }) {
      const file = await this.fileRepository.findOneById(fileId);
      if (!file || file.userId !== userId) throw new CustomHttpError("Have no access to file", 403);

      const localFilePath = join(process.cwd(), "uploads", userId, file.path);
      await fs.writeFile(localFilePath, content);

      const newFileSize = (await fs.stat(localFilePath)).size;
      await this.fileRepository.updateOne({ data: { size: newFileSize }, fileId, userId });
      const differenceSize = newFileSize - file.size;
      const user = await this.userService.getUserById(userId);
      await this.userService.updateUser(userId, { usedSpace: user.usedSpace + differenceSize });
   }
}
export default FileService;
