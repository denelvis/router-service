export const torrentConnectStringBuilder = (
  routerInstance: string
): string[] => {
  return [
    `https://${routerInstance}/tracker/announce`,
    `wss://${routerInstance}:443/tracker/socket`,
  ];
};
