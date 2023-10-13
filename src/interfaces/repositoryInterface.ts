import { User } from "@prisma/client";

abstract class Repository {
   abstract findOne(unique: string): any;
   abstract create(...args: any): any;
}

export abstract class UserRepositoryInterface implements Repository {
   abstract findOne(unique: string): Promise<User | null>;
   abstract create(args: { username: string; password: string; email: string }): Promise<User>;
}

export abstract class FileRepositoryInterface implements Repository {
   abstract findOne(unique: string): Promise<File | null>;
   abstract create(name: string, type: string, userId: string): Promise<File>;
}
