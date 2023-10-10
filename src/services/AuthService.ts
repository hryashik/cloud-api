import { SignupDto } from "../types/signup.dto";
import { IAuthService } from "../interfaces/AuthServiceInterface";
import bcrypt from "bcrypt";
import User from "../models/User";
import mongoose, { MongooseError } from "mongoose";
import { CustomHttpError } from "../errors/customHttpError";
import JWTService from "./jwtService";
import { LoginDto } from "../types/login.dto";
import UserRepository from "../repositories/user.repository";

export class AuthService implements IAuthService {
   constructor(private jwtService: JWTService, private userRep: UserRepository) {}

   async createUser(dto: SignupDto): Promise<string> {
      try {
         //gen hash
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(dto.password, salt);
         dto.password = hashedPassword;

         //create user
         const user = await User.create(dto);

         //create token
         const token = this.jwtService.createToken(dto.email);
         return token;
      } catch (error) {
         if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
            console.error(error);
            throw new CustomHttpError("Credentials is taken", 409);
         } else {
            throw new Error();
         }
      }
   }

   async checkCkredetials(dto: LoginDto): Promise<string> {
      try {
         // find user
         const user = await this.userRep.findOne(dto.email);
         if (!user) {
            throw new CustomHttpError("User not found", 403);
         }

         // check hash
         const verifyPwd = await bcrypt.compare(dto.password, user.password);
         if (!verifyPwd) {
            throw new CustomHttpError("User not found", 403);
         }

         // create token
         const token = this.jwtService.createToken(dto.email);
         return token;
      } catch (error) {
         if (error instanceof CustomHttpError) {
            throw new CustomHttpError("Incorrect credentials", 403);
         } else {
            console.error(error);
            throw new Error("Something went wrong");
         }
      }
   }
}

export default AuthService;
