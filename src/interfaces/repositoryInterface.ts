import { File, User } from "@prisma/client";
import { UpdateUserDto } from "../types/updateUser.dto";
import { UserDto } from "../types/user.dto";
import { updateFileDto } from "../types/updateFileDto";

interface Repository {
   findOneById(unique: string): any;
   create(...args: any): any;
}

export abstract class UserRepositoryInterface implements Repository {
   abstract findOneByEmail(email: string): Promise<User | null>;
   abstract findOneById(id: string): Promise<User | null>;
   abstract create(args: { username: string; password: string; email: string }): Promise<User>;
   abstract updateOne(params: UpdateUserDto): Promise<User | null>;
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
   abstract create(args: fileRepCreateFileDto): Promise<File>;
   abstract findMany(userId: string): Promise<File[]>;
   abstract findOneByPath(path: string): Promise<File | null>;
   abstract deleteMany(path: string): Promise<void>;
   abstract createMany(args: fileRepCreateManyDto[]): any;
   abstract updateOne(args: updateFileDto): Promise<File>;
}
