import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import authRouter from "./routers/authRouter";
import { errorHandler } from "./middlewares/errorHandler";
import filesRouter from "./routers/filesRouter";
import cors from "cors";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/auth", authRouter);
app.use("/files", filesRouter);
app.use(errorHandler);

async function start() {
   try {
      app.listen(port, () => console.log(`Server starts on ${port}`));
   } catch (error) {
      console.error(error);
   }
}

start();
