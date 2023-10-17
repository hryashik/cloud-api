import { NextFunction, Request, Response } from "express";
import { SignupDto } from "../types/signup.dto";
import { AuthServiceInterface } from "../interfaces/servicesInterfaces";
import { CustomHttpError } from "../errors/customHttpError";
import { UpdateUserDto } from "../types/updateUser.dto";

interface ISignupReq extends Request {
   body: SignupDto;
}
interface ILoginReq extends Request {
   body: {
      email: string;
      password: string;
   };
}
interface IUpdateUserReq extends Request {
   body: {
      username?: string;
      email?: string;
      avatar?: string;
   };
}

export default class AuthController {
   private authService;

   constructor(authService: AuthServiceInterface) {
      this.authService = authService;
      this.signup = this.signup.bind(this);
      this.login = this.login.bind(this);
      this.getUserByToken = this.getUserByToken.bind(this);
      this.updateUser = this.updateUser.bind(this);
   }

   async signup(req: ISignupReq, res: Response, next: NextFunction) {
      try {
         const dto = req.body;
         const data = await this.authService.createUser(dto);
         res.json({ token: data });
      } catch (error) {
         next(error);
      }
   }

   async login(req: ILoginReq, res: Response, next: NextFunction) {
      try {
         const dto = req.body;
         const token = await this.authService.checkCredentials(dto);
         res.send({ token });
      } catch (error) {
         next(error);
      }
   }

   async getUserByToken(req: Request, res: Response, next: NextFunction) {
      try {
         // Check token
         const userId = req.user?.id;
         if (!userId) throw new CustomHttpError("Unauthorized", 401);

         const user = await this.authService.getUserById(userId);
         res.json(user);
      } catch (error) {
         next(error);
      }
   }

   async updateUser(req: IUpdateUserReq, res: Response, next: NextFunction) {
      try {
         const userId = req.user?.id;
         if (!userId) throw new CustomHttpError("Unauthorized", 401);

         const dto = req.body;
         const user = await this.authService.updateUser(userId, dto);
         return user;
      } catch (error) {
         next(error);
      }
   }
}
