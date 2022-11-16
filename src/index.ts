import { randomUUID } from "node:crypto";
import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import { WebSocket } from "ws";
import http from "http";
import helmet from "helmet";
import cors from "cors";
import requestIp from "request-ip";
import createError, { HttpError } from "http-errors";
import bodyParser from "body-parser";

import { logMiddleware } from "./logger/log.middleware";
import * as locals from "./locals";
import wsRouter from "./apis/wss.route";

const app = express();
const pinoLogger = logMiddleware("wss");
const server = http.createServer(app);

app.use(helmet());
app.use(json());
app.use(cors());
app.use(bodyParser.json());
app.use(urlencoded({ extended: false }));
app.use(requestIp.mw({ attributeName: "ip" }));

app.use(pinoLogger);

app.use("/", wsRouter);

const ws = new WebSocket.Server({ server });
app.set("socket", ws);

const bootstrap = async () => {
  try {
    ws.on("connection", (ws: WebSocket) => {
      const id = randomUUID();
      ws.on("message", (msg: string) => {
        console.log("receive:", msg.toString());
        ws.send(`${msg} was sent`);
      });

      ws.on("close", () => {
        console.log(`${id} left`);
      });

      ws.send("websocket server connected");
    });

    ws.on("message", (msg) => console.log(msg));

    server.listen(locals.PORT, () =>
      console.log(`server started on ${locals.PORT}`)
    );

    process.on("SIGINT", () => {
      ws.close();
      process.exit();
    });
  } catch (e) {
    console.log(e);
  }
};

bootstrap();

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
