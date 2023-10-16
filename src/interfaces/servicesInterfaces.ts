import { File, User } from "@prisma/client";
import { SignupDto } from "../types/signup.dto";
import { LoginDto } from "../types/login.dto";

export interface JWTServiceInterface {
   createToken(email: string): string;
   verifyToken(token: string): Promise<User | null>;
}

export interface AuthServiceInterface {
   createUser(dto: SignupDto): Promise<string>;
   checkCredentials(dto: LoginDto): Promise<string>;
   getUserById(userId: string): Promise<User>;
}

export interface FileServiceInterface {
   createDir(dto: { name: string; userId: string }): Promise<File>;
   deleteFile(args: { userId: string; fileId: string }): void;
}
