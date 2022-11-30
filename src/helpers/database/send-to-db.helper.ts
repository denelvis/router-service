import { WebSocket } from "ws";

import { serviceId } from "../../locals";
import { dbMain, dbOwn } from "../../services/database";
import { isValidJson, validFiles } from "..";
import { IVideoFile } from "./../../interfaces";

export const sendToDb = (id: string, files: IVideoFile[], ws: WebSocket) => {
  if (validFiles(files).length === 0) {
    return ws.send("Message has not valid files to share");
  }

  dbOwn.set(id, JSON.stringify(files));
  const allFiles = dbOwn.JSON();
  dbMain.set(serviceId, JSON.stringify(allFiles));
};
