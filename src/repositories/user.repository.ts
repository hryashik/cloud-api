import mongoose from "mongoose";
import { CustomRepositoryError } from "../errors/customRepositoryError";
import User from "../models/User";

class UserRepository {
   async findOne(email: string) {
      try {
         const user = User.findOne({ email });
         return user;
      } catch (error) {
         throw new CustomRepositoryError("Some error with DB");
      }
   }

   async create(data: { email: string; password: string; username: string }) {
      try {
         const user = await User.create(data);
         return user;
      } catch (error) {
         if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
            throw new CustomRepositoryError("Some error with DB");
         }
      }
   }
}

export default UserRepository;
