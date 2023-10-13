import { CustomRepositoryError } from "../errors/customRepositoryError";
import { UserRepositoryInterface } from "../interfaces/repositoryInterface";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";

class UserRepository implements UserRepositoryInterface {
   private static instance: UserRepository | null;
   private prisma = new PrismaService();
   constructor() {
      if (UserRepository.instance) {
         return UserRepository.instance;
      }
      UserRepository.instance = this;
   }

   async findOne(email: string) {
      try {
         const user = this.prisma.user.findUnique({
            where: {
               email,
            },
         });
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
         const user = await this.prisma.user.create({
            data: {
               email,
               username,
               hash: password,
            },
         });
         return user;
      } catch (error) {
         console.log(error);
         throw new CustomRepositoryError("Some error with DB");
      }
   }
}

export default UserRepository;
