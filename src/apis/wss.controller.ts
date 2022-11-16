import { NextFunction, Request, Response } from "express";
import { WebSocket } from "ws";

import { db } from "../services/database";

class WssController {
  async listFilesById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const files = db.get(id);

      return res.status(200).send({ [id]: files });
    } catch (e) {
      return next(e);
    }
  }

  async listAllFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const files = db.JSON();

      return res.status(200).send(files);
    } catch (e) {}
  }

  async changeFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, files } = req.body;
      db.set(id, JSON.stringify(files));

      const ws: WebSocket = await req.app.get("socket");
      ws.emit("message", "mess");

      return res.status(200).json({ id });
    } catch (e) {
      return next(e);
    }
  }
}

export const wssController = new WssController();
