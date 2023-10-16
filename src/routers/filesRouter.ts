import { Router } from "express";
import FilesController from "../controllers/files.controller";
import jwtGuard from "../middlewares/guards/jwt.guard";
import multer from "multer";
import FileService from "../services/files.service";
import FileRepository from "../repositories/files.repository";
import UserRepository from "../repositories/user.repository";
import AuthService from "../services/auth.service";
import JWTService from "../services/jwt.service";

const upload = multer({
   dest: "uploads",
   limits: {
      fileSize: 20 * 1024 * 1024,
   },
});
const filesRouter = Router();

// REPOSITORIES
const fileRepository = new FileRepository();
const userRepository = new UserRepository();

// SERVICES
const jwtService = new JWTService();
const userService = new AuthService(jwtService, userRepository);
const filesService = new FileService(fileRepository, userService);

// CONTROLLERS
const filesController = new FilesController(filesService);

filesRouter.use(jwtGuard);
filesRouter.get("/", filesController.getFiles);
filesRouter.post("/", upload.array("files", 10), filesController.create);
filesRouter.delete("/:fileId", filesController.deleteFile);

export default filesRouter;
