import { randomUUID } from "node:crypto";
import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import { Server, WebSocket } from "ws";
import http from "http";
import https from "https";
import helmet from "helmet";
import cors from "cors";
import requestIp from "request-ip";
import createError, { HttpError } from "http-errors";
import bodyParser from "body-parser";

import { logMiddleware } from "./logger/log.middleware";
import wsRouter from "./apis/wss.route";
import { disconnectHelper, sendToDb } from "./helpers";

export class Service {
  declare readonly port: number;
  declare readonly key: string;
  declare readonly cert: string;

  declare app: any;
  declare server: https.Server | http.Server;
  declare wss: Server<WebSocket>;
  declare clients: Record<any, any>;

  constructor(port: number, key?: string, cert?: string) {
    this.port = port;
    this.key = key;
    this.cert = cert;
    this.app = express();
    this.server =
      this.key && this.cert
        ? https.createServer({ key: this.key, cert: this.cert }, this.app)
        : http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
  }

  public async run() {
    const app = this.app;
    const pinoLogger = logMiddleware("wss");
    const server = this.server;

    app.use(helmet());
    app.use(json());
    app.use(cors());
    app.use(bodyParser.json());
    app.use(urlencoded({ extended: false }));
    app.use(requestIp.mw({ attributeName: "ip" }));
    app.use(pinoLogger);

    app.use("/", wsRouter);

    const wss = this.wss;

    this.clients = {};

    try {
      wss.on("connection", (ws: WebSocket) => {
        const id = randomUUID();
        this.clients[id] = ws;

        ws.on("message", (msg: string) => {
          console.log("receive:", msg.toString());
          ws.send(`${msg} was sent`);
          sendToDb(id, msg.toString());
        });

        ws.on("close", () => {
          delete this.clients[id];
          disconnectHelper(id);
          console.log(`${id} left`);
        });

        ws.send("websocket server connected");
      });

      wss.on("message", (msg) => console.log(msg));

      server.listen(this.port, () =>
        console.log(`server started on ${this.port}`)
      );

      app.use(function (req, res, next) {
        next(createError(404));
      });

      app.use(function (
        err: HttpError,
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        res.status(err.status || 500);
        res.json({
          error: `${err.name}: ${err.message}`,
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  public destroy() {
    this.wss.close();
    this.server.close(() => process.exit());
  }
}
