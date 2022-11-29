import { WebSocket } from "ws";


import { serviceId } from "../../locals";
import { dbMain, dbOwn } from "../../services/database";
import { isValidFile, isValidJson } from "..";

export const sendToDb = (id: string, msg: string, ws: WebSocket) => {
  if (!isValidJson(msg)) {
    return ws.send("Message is not a JSON string");
  }

  if (!isValidFile(JSON.parse(msg))) {
    return ws.send("Message is not video or file");
  }

  dbOwn.set(id, msg);
  const allFiles = dbOwn.JSON();
  dbMain.set(serviceId, JSON.stringify(allFiles));
};
