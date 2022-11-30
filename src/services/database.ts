import JSONdb from "simple-json-db";
import path from "path";
import { IVideoFile } from "../interfaces";

const fullDataBaseLocation = path.join(process.cwd(), "./src/services/all_services_files.json");
const ownDataBaseLocation = path.join(process.cwd(), "./src/services/electron_files.json");

export const dbMain: JSONdb<string> = new JSONdb(fullDataBaseLocation);
export const dbOwn = new JSONdb(ownDataBaseLocation);
