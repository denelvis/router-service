import { NextFunction, Request, Response } from "express";

class WssController {
  async listFiles(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({});
    } catch (e) {}
  }

  async changeFiles(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (e) {}
  }
}

export const wssController = new WssController();
