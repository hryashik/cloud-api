import { File, User } from "@prisma/client";

interface Repository {
   findOneById(unique: string): any;
   createFile(...args: any): any;
}

export abstract class UserRepositoryInterface implements Repository {
   abstract findOneByEmail(email: string): Promise<User | null>;
   abstract findOneById(id: string): Promise<User | null>;
   abstract createFile(args: { username: string; password: string; email: string }): Promise<User>;
}

export type fileRepCreateFileDto = {
   name: string;
   type: string;
   userId: string;
   path: string;
   size?: number;
   parentId?: string;
};

export type fileRepCreateManyDto = {
   name: string;
   type: string;
   userId: string;
   path: string;
   size: number;
   parentId?: string;
};

export abstract class FileRepositoryInterface implements Repository {
   abstract findOneById(unique: string): Promise<File | null>;
   abstract createFile(args: fileRepCreateFileDto): Promise<File>;
   abstract findMany(userId: string): Promise<File[]>;
   abstract findOneByPath(path: string): Promise<File | null>;
   abstract deleteMany(path: string): void;
   abstract createMany(args: fileRepCreateManyDto[]): any;
}
