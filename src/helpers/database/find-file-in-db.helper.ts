import { IVideoFile } from "../../interfaces";
import { dbMain } from "../../services";
import { torrentConnectStringBuilder } from "../common";

export const findFileInDb = (videoId: string): string[] | undefined => {
  const allFiles = dbMain.JSON();

  for (const service in allFiles) {
    const index = (allFiles[service] as unknown as IVideoFile[]).findIndex(
      (file) => file.id === videoId
    );

    if (~index) {
      return torrentConnectStringBuilder(service);
    }
  }
};
