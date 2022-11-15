import { Router } from "express";
import { wssController } from "./wss.controller";

const router = Router();

router.get("/list/files", wssController.listFiles);
router.post("/change/files", wssController.changeFiles);

export default router;
