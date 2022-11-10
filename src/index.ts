import express, { json, NextFunction, Request, Response, urlencoded } from "express";
import http from "http";
import helmet from "helmet";
import cors from "cors";
import { WebSocket } from "ws";
import requestIp from "request-ip";
import createError, { HttpError } from "http-errors";

import { logMiddleware } from "./logger/log.middleware";

const app = express();

app.use(helmet());
app.use(json());
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(requestIp.mw({ attributeName: "ip" }));

const pinoLogger = logMiddleware("wss");

app.use(pinoLogger);

const server = http.createServer(app);

const ws = new WebSocket.Server({ server });

const bootstrap = async () => {
  try {
    ws.on("connection", (ws: WebSocket) => {
      ws.on("message", (msg: string) => {
        console.log("receive:", msg.toString());
        ws.send(`${msg} was sent`);
      });

      ws.send("websocket server connected");
    });

    server.listen(8999, () => console.log("server 8999"));
  } catch (e) {
    console.log(e);
  }
};

bootstrap();

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    error: `${err.name}: ${err.message}`
  });
});
