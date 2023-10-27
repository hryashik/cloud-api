import { Router } from "express";
import FilesController from "../controllers/files.controller";
import jwtGuard from "../middlewares/guards/jwt.guard";
import multer, { MulterError } from "multer";
import FileService from "../services/files.service";
import FileRepository from "../repositories/files.repository";
import UserRepository from "../repositories/user.repository";
import AuthService from "../services/auth.service";
import JWTService from "../services/jwt.service";
import { CustomHttpError } from "../errors/customHttpError";

const upload = multer({
   dest: "uploads",
   limits: {
      fileSize: 50 * 1024 * 1024,
   },
   fileFilter(req, file, callback) {
      if (decodeURI(file.originalname).length > 30) {
         return callback(new CustomHttpError("File name must contain no more 30 symbols", 413));
      }
      callback(null, true);
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
filesRouter.get("/:id", filesController.getFileById);
filesRouter.post("/", upload.array("files", 10), filesController.create);
filesRouter.delete("/:fileId", filesController.deleteFile);
filesRouter.post("/upload", filesController.uploadFiles);
filesRouter.put("/:fileId", filesController.updateContentFile);

export default filesRouter;
