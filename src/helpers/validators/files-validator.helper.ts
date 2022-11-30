import { make } from "simple-body-validator";
import { IVideoFile } from "../../interfaces";
import { fileRules, videoRules } from "../../validator";

export const validFiles = (videoOrFiles: IVideoFile[]): IVideoFile[] => {

  const validVideos = videoOrFiles.filter((video) => {
    const validatorVideo = make(video, videoRules);
    return validatorVideo.validate();
  });

  const validFiles = videoOrFiles.filter((file) => {
    const validatorFile = make(file, fileRules);
    return validatorFile.validate();
  });

  return [...validVideos, ...validFiles];
};
