import { Response } from "express"

export type getFileByIdDto = {
   userId: string,
   fileId: string,
   res: Response
}