import { SignupDto } from "../types/signup.dto";

export abstract class AuthServiceInterface {
   abstract createUser(dto: SignupDto): Promise<string>;
}
