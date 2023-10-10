import File, { FileType } from "../models/File";
import { Repository } from "./interface";

/* class FilesRepository implements Repository<FileType & { _id: string }> {
   async find(userId: string, path: string): Promise<FileType[] | null> {
      const data = await File.where({user: });
   }
} */
