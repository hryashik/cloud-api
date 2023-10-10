import { NextFunction, Request, Response } from "express";
import joi, { ValidationError } from "joi";
import { SignupDto } from "../../types/signup.dto";

const schema = joi.object<SignupDto>({
   email: joi.string().min(5).max(30).email({ minDomainSegments: 2 }).required(),
   password: joi.string().min(6).max(20).required(),
});

async function authLoginValidate(req: Request, res: Response, next: NextFunction) {
   try {
      const dto = req.body;
      await schema.validateAsync(dto);
      next();
   } catch (error) {
      if (error instanceof ValidationError) {
         res.status(400).json({ message: error.message }).end();
      } else {
         res.status(500).json({ message: "Something wrong" });
      }
   }
}

export default authLoginValidate;