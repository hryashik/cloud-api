export type UpdateUserDto = {
   userId: string;
   data: {
      email?: string;
      avatar?: string;
      usedSpace?: number;
      username?: string
   };
};
