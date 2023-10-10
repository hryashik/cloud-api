import { UserType } from "../models/User";
import { LoginDto } from "../types/login.dto";
import { SignupDto } from "../types/signup.dto";

export interface IAuthService {
   createUser(dto: SignupDto): Promise<string>;
   checkCkredetials(dto: LoginDto): Promise<string>;
}
