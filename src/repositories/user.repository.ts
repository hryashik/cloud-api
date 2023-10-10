import mongoose from "mongoose";
import { CustomRepositoryError } from "../errors/customRepositoryError";
import User, { UserType } from "../models/User";

class UserRepository {
   private static instance: UserRepository | null;
   constructor() {
      if (UserRepository.instance) {
         return UserRepository.instance;
      }
      UserRepository.instance = this;
   }
   
   async findOne(email: string) {
      try {
         const user = await User.findOne({ email }).lean();
         return user;
      } catch (error) {
         throw new CustomRepositoryError("Some error with DB");
      }
   }

   async create({
      email,
      username,
      password,
   }: {
      email: string;
      password: string;
      username: string;
   }) {
      try {
         const user = (await User.create({ email, username, hash: password })).toObject();
         return user;
      } catch (error) {
         throw new CustomRepositoryError("Some error with DB");
      }
   }
}

export default UserRepository;
