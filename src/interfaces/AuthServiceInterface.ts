import { LoginDto } from "../types/login.dto";
import { SignupDto } from "../types/signup.dto";

export interface IAuthService {
   createUser(dto: SignupDto): Promise<string>;
   checkCredentials(dto: LoginDto): Promise<string>;
}
