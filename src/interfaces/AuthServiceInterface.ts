import { UserType } from "../models/User";
import { signupDto } from "../types/signup.dto";

export interface IAuthService {
   createUser(dto: signupDto): Promise<UserType | undefined>;
}