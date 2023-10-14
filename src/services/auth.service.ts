import { SignupDto } from "../types/signup.dto";
import bcrypt from "bcrypt";

import { CustomHttpError } from "../errors/customHttpError";
import JWTService from "./jwt.service";
import { LoginDto } from "../types/login.dto";
import { AuthServiceInterface } from "../interfaces/servicesInterfaces";
import { UserRepositoryInterface } from "../interfaces/repositoryInterface";

export class AuthService implements AuthServiceInterface {
   constructor(private jwtService: JWTService, private userRepository: UserRepositoryInterface) {}

   async createUser(dto: SignupDto) {
      //gen hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);
      dto.password = hashedPassword;

      //create user
      const user = await this.userRepository.create(dto);
      //create token
      const token = this.jwtService.createToken(dto.email);
      return token;
   }

   async checkCredentials(dto: LoginDto): Promise<string> {
      // find user
      const user = await this.userRepository.findOne(dto.email);
      if (!user) {
         throw new CustomHttpError("User not found", 401);
      }

      // check hash
      const verifyPwd = await bcrypt.compare(dto.password, user.hash);
      if (!verifyPwd) {
         throw new CustomHttpError("User not found", 401);
      }

      // create token
      const token = this.jwtService.createToken(dto.email);
      return token;
   }
}

export default AuthService;
