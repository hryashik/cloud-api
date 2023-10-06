import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import { authRouter } from "./routers/router";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/auth", authRouter);

app.listen(port, () => console.log(`Server starts on ${port}`));
