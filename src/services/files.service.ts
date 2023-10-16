import { CustomHttpError } from "../errors/customHttpError";
import { FileRepositoryInterface, fileRepCreateFileDto } from "../interfaces/repositoryInterface";
import { FileServiceInterface } from "../interfaces/servicesInterfaces";
import { CreateDirDTO } from "../types/createDir.dto";

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
}
export default FileService;
