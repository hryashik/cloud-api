import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient {
   private static instance: PrismaService;
   constructor() {
      if (PrismaService.instance) {
         return PrismaService.instance;
      } else {
         super({
            datasources: {
               db: {
                  url: process.env.DATABASE_URL,
               },
            },
         });
         PrismaService.instance = this;
      }
   }
}
