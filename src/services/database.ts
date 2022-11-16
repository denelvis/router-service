import JSONdb from "simple-json-db";
import path from "path";

const dbLocation = path.join(process.cwd(), "./src/services/server_files.json");

export const db = new JSONdb(dbLocation);
