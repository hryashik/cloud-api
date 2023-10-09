import jwt from "jsonwebtoken";

class JWTService {
   createToken(email: string) {
      try {
         const key = process.env.JWT_KEY!!;
         const token = jwt.sign({ email }, key, { expiresIn: 60 });
         return token;
      } catch (error) {
         console.error(error);
         throw new Error("JWT ERROR");
      }
   }
   /* async verifyToken() {
      jwt.verify()
   } */
}

export default JWTService;
