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
import {
  disconnectHelper,
  findFileInDb,
  sendToDb,
  torrentConnectStringBuilder,
} from "./helpers";
import { BitTorrentService } from "./torrent";
import { serviceId } from "./locals";

export class RouterServerService {
  private declare readonly port: number;
  private declare readonly key: string;
  private declare readonly cert: string;

  private declare app: any;
  private declare server: https.Server | http.Server;
  private declare wss: Server<WebSocket>;
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

        ws.on("message", (message: string) => {
          const msg = JSON.parse(message.toString());

          if (Object.keys(msg).includes("files")) {
            sendToDb(id, msg.files, ws);
            const routerServersUrls = torrentConnectStringBuilder(serviceId);
            ws.send(JSON.stringify({ routerServersUrls }));
          }

          if (Object.keys(msg).includes("find")) {
            const holderFileServiceUrls = findFileInDb(msg.find);
            if (holderFileServiceUrls) {
              ws.send(JSON.stringify({ holderFileServiceUrls }));
            }
          }
        });

        ws.on("close", () => {
          delete this.clients[id];
          disconnectHelper(id);
          console.log(`${id} left`);
        });
      });

      server.listen(this.port, () =>
        console.log(`server started on ${this.port}`)
      );

      app.use(function (req: Request, res: Response, next: NextFunction) {
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

BitTorrentService();
