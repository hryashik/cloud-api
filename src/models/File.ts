import { StringSchema } from "joi";
import { Schema, model } from "mongoose";
import { UserType } from "./User";

export type FileType = {
   name: string;
   type: string;
   accessLink?: string;
   size: number;
   path: string;
   date: string;
   user: UserType;
   parent: FileType;
   childs: FileType[]
};

const File = new Schema({
   name: { type: String, require: true },
   type: { type: String, require: true },
   accessLink: { type: String },
   size: { type: Number, default: 0 },
   path: { type: String, default: 0 },
   date: { type: Date, default: Date.now() },
   user: { type: Schema.Types.ObjectId, ref: "User" },
   parent: { type: Schema.Types.ObjectId, ref: "File" },
   childs: [{ type: Schema.Types.ObjectId, ref: "File" }],
});

export default model("File", File);
