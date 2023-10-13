import { NextFunction, Request, Response, Router } from "express";
import FilesController from "../controllers/files.controller";
import jwtGuard from "../middlewares/guards/jwt.guard";
import multer from "multer";
import FilesService from "../services/files.service";

const upload = multer({
   dest: "uploads",
   limits: {
      fileSize: 20 * 1024 * 1024,
   },
});

const filesRouter = Router();

const filesService = new FilesService();
const filesController = new FilesController(filesService);

filesRouter.use(jwtGuard);
filesRouter.get("/", filesController.getFiles);
filesRouter.post("/", upload.array("files", 10), filesController.saveFiles);

export default filesRouter;
