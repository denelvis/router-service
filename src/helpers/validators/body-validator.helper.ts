import { make } from "simple-body-validator";
import { fileRules, videoRules } from "../../validator";

export const isValidFile = (obj: {}): boolean => {
  const validatorVideo = make(obj, videoRules);
  const validatorFiles = make(obj, fileRules);

  if (!validatorFiles.validate() && !validatorVideo.validate()) {
    return false;
  }

  return true;
};
