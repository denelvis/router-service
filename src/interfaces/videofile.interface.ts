interface IVideoFileInfos {
  dir: string;
  masterSwarmId: string;
  segments: Map<string, string>;
  thumbnail: string;
  trackerUrls: string[];
  videoDetails: Record<string, string | number>;
}

interface IVideoFileVideo {
  internalURL: string;
}

export interface IVideoFile {
  id: string;
  infos: IVideoFileInfos;
  size: number;
  video: IVideoFileVideo;
}
