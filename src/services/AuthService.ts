import { signupDto } from "../types/signup.dto";
import { IAuthService } from "../interfaces/AuthServiceInterface";
import bcrypt from "bcrypt";
import User, { UserType } from "../models/User";
import mongoose from "mongoose";
import { CustomError } from "../errors/customError";
import JWTService from "./jwtService";
import jwt from "jsonwebtoken";

export class AuthService implements IAuthService {
   constructor(private jwtService: JWTService) {}
   async createUser(dto: signupDto) {
      try {
         //gen hash
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(dto.password, salt);
         dto.password = hashedPassword;
         //create user
         const user = await User.create(dto);
         //create token
         const token = this.jwtService.createToken(dto.email);
         /* const data: UserType = {
            email: user.email,
            avatar: user.avatar,
            diskSpace: user.diskSpace,
            files: user.files,
            usedSpace: user.usedSpace,
            username: user.username,
         }; */
         return token;
      } catch (error) {
         if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
            console.error(error);
            throw new CustomError("Credentials is taken", 409);
         } else {
            throw new Error();
         }
      }
   }
}

export default AuthService;
