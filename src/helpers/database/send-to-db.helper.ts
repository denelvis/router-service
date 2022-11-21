import { make } from "simple-body-validator";
import { serviceId } from "../../locals";

import { dbMain, dbOwn } from "../../services/database";
import { isValidFile, isValidJson } from "..";

export const sendToDb = (id: string, msg: string) => {
  if (!isValidJson(msg)) {
    throw new Error("Message is not a JSON string");
  }

  if (!isValidFile(JSON.parse(msg))) {
    throw new Error("Message is not video or file");
  }

  dbOwn.set(id, msg);
  const allFiles = dbOwn.JSON();
  dbMain.set(serviceId, JSON.stringify(allFiles));
};
