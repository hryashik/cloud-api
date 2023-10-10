import { FileType } from "../models/File";

export interface IFilesService {
   getFiles(): Promise<FileType[]>;
}
