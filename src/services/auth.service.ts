import { SignupDto } from "../types/signup.dto";
import bcrypt from "bcrypt";
import { CustomHttpError } from "../errors/customHttpError";
import JWTService from "./jwt.service";
import { LoginDto } from "../types/login.dto";
import { AuthServiceInterface } from "../interfaces/servicesInterfaces";
import { UserRepositoryInterface } from "../interfaces/repositoryInterface";
import fs from "node:fs";
import path from "node:path";

export class AuthService implements AuthServiceInterface {
   constructor(private jwtService: JWTService, private userRepository: UserRepositoryInterface) {}

   async createUser(dto: SignupDto) {
      //gen hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);
      dto.password = hashedPassword;

      //create user
      const user = await this.userRepository.create(dto);

      //create a user dir
      const dirPath = path.join(process.cwd(), "uploads", user.id);
      if (!fs.existsSync(dirPath)) {
         fs.mkdir(dirPath, (e) => {
            if (e) {
               console.error(e);
               throw new CustomHttpError("Internal server error", 500);
            }
         });
      }

      //create token
      const token = this.jwtService.createToken(dto.email);
      return token;
   }

   async checkCredentials(dto: LoginDto): Promise<string> {
      // find user
      const user = await this.userRepository.findOneById(dto.email);
      if (!user) {
         throw new CustomHttpError("Credentials is wrong", 401);
      }

      // check hash
      const verifyPwd = await bcrypt.compare(dto.password, user.hash);
      if (!verifyPwd) {
         throw new CustomHttpError("Credentials is wrong", 401);
      }

      // create token
      const token = this.jwtService.createToken(dto.email);
      return token;
   }

   async getUserById(userId: string) {
      const user = await this.userRepository.findOneById(userId);
      if (!user) throw new CustomHttpError("Unauthorized", 401);
      return user;
   }

   async updateUser(userId: string, data: { email?: string; usedSpace?: number; avatar?: string }) {
      const user = await this.userRepository.updateOne({ userId, data });
      if (!user) throw new CustomHttpError("Unauthorized", 401);
      return user;
   }
}

export default AuthService;
