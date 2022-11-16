import { Router } from "express";
import { wssController } from "./wss.controller";

const router = Router();

router.get("/list/files/:id", wssController.listFilesById);
router.get("/list/files", wssController.listAllFiles);
router.post("/change/files", wssController.changeFiles);

export default router;
