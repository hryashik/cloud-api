export type updateFileDto = {
   userId: string;
   fileId: string
   data: {
      name?: string,
      path?: string,
      size?: number
   }
}