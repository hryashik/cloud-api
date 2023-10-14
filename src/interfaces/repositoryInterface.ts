import { File, User } from "@prisma/client";

interface Repository {
   findOne(unique: string): any;
   createFile(...args: any): any;
}

export abstract class UserRepositoryInterface implements Repository {
   abstract findOne(unique: string): Promise<User | null>;
   abstract createFile(args: { username: string; password: string; email: string }): Promise<User>;
}

export type fileRepCreateFileDto = {
   name: string;
   type: string;
   userId: string;
   path?: string;
   size?: number
};

export abstract class FileRepositoryInterface implements Repository {
   abstract findOne(unique: string): Promise<File | null>;
   abstract createFile(args: fileRepCreateFileDto): Promise<File>;
   abstract findMany(userId: string): Promise<File[]>;
}
