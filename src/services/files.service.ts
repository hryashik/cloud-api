import { CustomHttpError } from "../errors/customHttpError";
import { FileRepositoryInterface, fileRepCreateManyDto } from "../interfaces/repositoryInterface";
import { FileServiceInterface } from "../interfaces/servicesInterfaces";
import { FileMulterType } from "../types/FileMulter";
import { CreateDirDTO } from "../types/createDir.dto";
import { extname } from "node:path";
import fs from "node:fs/promises";
import { join } from "node:path";

class FileService implements FileServiceInterface {
   constructor(private fileRepository: FileRepositoryInterface) {}

   async createDir({ path, name, userId }: CreateDirDTO) {
      if (path) {
         const parent = await this.fileRepository.findOneByPath(path);
         if (!parent) {
            throw new CustomHttpError("Incorrect data", 404);
         }

         const currentPath = `${path}/${name}`;
         const dir = await this.fileRepository.createFile({
            name,
            userId,
            path: currentPath,
            type: "dir",
            parentId: parent.id,
         });
         return dir;
      } else {
         const currentPath = name;
         const dir = await this.fileRepository.createFile({
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
      const file = await this.fileRepository.findOne(fileId);
      if (!file || file.userId !== userId) {
         throw new CustomHttpError("Incorrect data", 400);
      }

      this.fileRepository.deleteMany(file.path);
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

      files.forEach((el) => {
         const obj: fileRepCreateManyDto = {
            name: encodeURI(el.originalname),
            path: path ? `${path}/${el.originalname}` : el.originalname,
            type: extname(el.originalname),
            userId,
            size: el.size,
            parentId,
         };

         dto.push(obj);
      });
      const data = await this.fileRepository.createMany(dto);
      console.log(data);
   }
}
export default FileService;
