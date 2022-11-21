import { serviceId } from "../../locals";
import { dbMain, dbOwn } from "../../services/database";

export const disconnectHelper = (clientId: string) => {
  dbOwn.delete(clientId);
  const allFiles = dbOwn.JSON();

  dbMain.set(serviceId, JSON.stringify(allFiles));

  // TODO add axios post request
};
