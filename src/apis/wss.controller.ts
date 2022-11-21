import { NextFunction, Request, Response } from "express";
import { WebSocket } from "ws";

import { dbMain } from "../services/database";

class WssController {
  async listFilesById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const files = dbMain.get(id);

      return res.status(200).send({ [id]: files });
    } catch (e) {
      return next(e);
    }
  }

  async listAllFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const files = dbMain.JSON();

      return res.status(200).send(files);
    } catch (e) {}
  }

  async changeFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, files } = req.body;
      dbMain.set(id, JSON.stringify(files));

      // const ws: WebSocket = await req.app.get("socket");

      return res.status(200).json({ id });
    } catch (e) {
      return next(e);
    }
  }
}

export const wssController = new WssController();
