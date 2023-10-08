import { model, Schema } from "mongoose";

export type UserType = {
   email: string;
   username?: string;
   diskSpace: number;
   usedSpace: number;
   avatar: string;
   files: any;
};

const User = new Schema({
   email: { type: String, required: true, unique: true },
   username: { type: String, unique: true },
   password: { type: String, required: true },
   diskSpace: { type: Number, default: 1024 ** 2 * 50 },
   usedSpace: { type: Number, default: 0 },
   avatar: { type: String, default: "" },
   files: [{ type: Schema.Types.ObjectId, ref: "File" }],
});

export default model("User", User);
