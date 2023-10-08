import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import authRouter from "./routers/router";
import mongoose from "mongoose";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/auth", authRouter);

async function start() {
   try {
      await mongoose.connect(process.env.DB_URL!);
      app.listen(port, () => console.log(`Server starts on ${port}`));
   } catch (error) {
      console.error(error);
   }
}

start();
