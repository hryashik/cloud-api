import { CustomHttpError } from "../errors/customHttpError";
import { FileRepositoryInterface, fileRepCreateFileDto } from "../interfaces/repositoryInterface";
import { FileServiceInterface } from "../interfaces/servicesInterfaces";
import { CreateDirDTO } from "../types/createDir.dto";

class FileService implements FileServiceInterface {
   constructor(private fileRepository: FileRepositoryInterface) {}
   
   async createDir({ path, name, userId }: CreateDirDTO) {
      const dir = await this.fileRepository.createFile({ userId, name, path, type: "dir" });
      if (!dir) {
         throw new CustomHttpError("Error create dir", 500);
      }
      return dir;
   }

   async getAllFiles(userId: string) {
      const files = await this.fileRepository.findMany(userId)
      return files
   }
}
export default FileService;
