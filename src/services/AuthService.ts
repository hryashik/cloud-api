import { signupDto } from "../types/signup.dto";
import { IAuthService } from "../interfaces/AuthServiceInterface";
import bcrypt from "bcrypt";
import User, { UserType } from "../models/User";
import mongoose from "mongoose";
import { CustomError } from "../errors/customError";

export class AuthService implements IAuthService {
   async createUser(dto: signupDto) {
      try {
         //gen hash
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(dto.password, salt);
         dto.password = hashedPassword;
         //create user
         const user = await User.create(dto);
         const data: UserType = {
            email: user.email,
            avatar: user.avatar,
            diskSpace: user.diskSpace,
            files: user.files,
            usedSpace: user.usedSpace,
            username: user.username,
         };
         return data;
      } catch (error) {
         if (
            error instanceof mongoose.mongo.MongoServerError &&
            error.code === 11000
         ) {
            throw new CustomError("Credentials is taken", 409);
         } else {
            console.log("Something wrong");
         }
      }
   }
}

export default AuthService;
