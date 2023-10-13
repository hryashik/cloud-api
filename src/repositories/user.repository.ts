import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomRepositoryError } from "../errors/customRepositoryError";
import { UserRepositoryInterface } from "../interfaces/repositoryInterface";
import { PrismaService } from "../prisma/prisma.service";
import { CustomHttpError } from "../errors/customHttpError";

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
         console.error(error);
         throw new CustomRepositoryError("Some error with DB", 500);
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
         // credentials is taken
         if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
            throw new CustomRepositoryError("Credentials is taken", 409);
         } else {
            console.error(error);
            throw new CustomRepositoryError("@AUTH-REPOSITORY ERROR", 500);
         }
      }
   }
}

export default UserRepository;
