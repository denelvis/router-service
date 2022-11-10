import { randomUUID } from "node:crypto";
import pino from "pino";
import pinoExpress from "express-pino-logger";
import httpContext from "express-http-context";
import { Request, Response } from "express";

export const logMiddleware = (module: string) => {
  return pinoExpress({
    logger: module ? pino().child({ module }) : pino(),
    genReqId: function (req: Request) {
      if ((req as any).id) return (req as any).id;
      let id = httpContext.get("X-Request-Id");
      if (id) return id;
      id = randomUUID();
      httpContext.set("X-Request-Id", id);
      return id;
    },
  });
};
