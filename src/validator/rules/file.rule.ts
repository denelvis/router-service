export const fileRules = {
  id: ["required", "string"],
  infos: ["required", "object"],
  'infos.dir': ["required", "string"],
  'infos.masterSwarmId': ["required", "string"],
  'infos.segments': ["required", "object"],
  'infos.thumbnail': ["required", "string"],
  'infos.trackerUrls': ["required", "array"],
  'infos.videoDetails': ["required", "object"],
  size: ["required", "integer"],
  video: ["required", "object"],
  'video.internalURL': ["required", "string"],
};
