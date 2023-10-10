import { Router } from "express";
import FilesController from "../controllers/files.controller";

const filesRouter = Router();

const filesController = new FilesController();

filesRouter.get("/", filesController.getAllFiles);

export default filesRouter;