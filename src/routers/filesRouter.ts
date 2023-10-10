import { Router } from "express";
import FilesController from "../controllers/files.controller";
import jwtGuard from "../middlewares/guards/jwt.guard";

const filesRouter = Router();

const filesController = new FilesController();

filesRouter.get("/", jwtGuard, filesController.getFiles);

export default filesRouter;
