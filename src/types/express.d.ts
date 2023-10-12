import { FlattenMaps, Types } from "mongoose";
import { UserType } from "../models/User";
import { User } from "@prisma/client";

declare global {
   namespace Express {
      interface Request {
         user?: User
      }
   }
}
