export const videoRules = {
  name: ["required", "string"],
  bitrate: ["required", "string_number"],
  extName: ["required", "string"],
  size: ["required", "strict", "integer"],
};
