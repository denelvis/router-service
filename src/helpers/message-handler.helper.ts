import { make } from "simple-body-validator";
import { serviceId } from "../locals";

import { db } from "../services/database";
import { fileRules, videoRules } from "../validator";

export const messageHandlerNHelper = (id: string, msg: string) => {
  let message: {};
  try {
    message = JSON.parse(msg);
  } catch (e) {
    throw new Error("Message is not a JSON string");
  }

  const validatorVideo = make(message, videoRules);
  const validatorFiles = make(message, fileRules);

  if (!validatorFiles.validate() && !validatorVideo.validate()) {
    throw new Error("Message is not video or file");
  }

  db.set(serviceId, JSON.stringify({ id: message }));
};
