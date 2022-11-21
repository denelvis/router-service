import { randomUUID } from "node:crypto";
import dotenv from "dotenv-flow";
dotenv.config({ silent: true });

export const serviceId = randomUUID();

export const PORT = parseInt(process.env.PORT || "8099", 10);
