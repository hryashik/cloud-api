import { customRepositoryError } from "../errors/customRepositoryError";
import User from "../models/User";

class UserRepository {
   async findOne(email: string) {
      try {
         const user = User.findOne({ email });
         return user;
      } catch (error) {
         console.error(error);
         throw new customRepositoryError("Some error with DB");
      }
   }
}

export default UserRepository;