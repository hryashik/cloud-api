import { signupDto } from "../types/signup.dto";
import { IAuthService } from "../interfaces/AuthServiceInterface";
import bcrypt from "bcrypt";
import User, { UserType } from "../models/User";
import mongoose from "mongoose";

export class AuthService implements IAuthService {
   async createUser(dto: signupDto) {
      try {
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(dto.password, salt);
         dto.password = hashedPassword;
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
            throw new Error("credentials is taken");
         } else {
            console.log("Something wrong")
         }
      }
   }
}

export default AuthService;
