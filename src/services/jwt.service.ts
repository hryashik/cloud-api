import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import UserRepository from "../repositories/user.repository";
import { CustomHttpError } from "../errors/customHttpError";
import { JWTServiceInterface } from "../interfaces/servicesInterfaces";

class JWTService implements JWTServiceInterface{
   private static instance: JWTService | null;
   private userRepository = new UserRepository();
   constructor() {
      if (JWTService.instance) {
         return JWTService.instance;
      }
      JWTService.instance = this;
   }

   createToken(email: string) {
      try {
         const key = process.env.JWT_KEY!!;
         const token = jwt.sign({ email }, key, { expiresIn: "1d" });
         return token;
      } catch (error) {
         console.error(error);
         throw new Error("JWT ERROR");
      }
   }

   async verifyToken(token: string) {
      try {
         const key = process.env.JWT_KEY!!;
         const { email } = jwt.verify(token, key) as { email: string };
         const user = await this.userRepository.findOneByEmail(email);
         return user;
      } catch (error) {
         if (error instanceof TokenExpiredError) {
            throw new CustomHttpError("Token is expired", 403);
         } else if (error instanceof JsonWebTokenError) {
            throw new CustomHttpError("Token is malformed", 401)
         }
         console.log(error)
         throw new Error("JWT VERIFY ERROR");
      }
   }
}

export default JWTService;
