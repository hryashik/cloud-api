import { StringSchema } from "joi";
import { Schema, model } from "mongoose";
import { UserType } from "./User";

export type FileType = {
   name: string;
   type: string;
   accessLink?: string;
   size: number;
   path: string;
   date: Date;
   user: UserType;
   parent: FileType;
   childs: FileType[];
};

const FileSchema = new Schema<FileType>({
   name: { type: String, require: true },
   type: { type: String, require: true },
   accessLink: { type: String },
   size: { type: Number, default: 0 },
   path: { type: String, default: "" },
   date: { type: Date, default: Date.now() },
   user: { type: Schema.Types.ObjectId, ref: "User" },
   parent: { type: Schema.Types.ObjectId, ref: "File" },
   childs: [{ type: Schema.Types.ObjectId, ref: "File" }],
});

const File = model("File", FileSchema)
export default File;
