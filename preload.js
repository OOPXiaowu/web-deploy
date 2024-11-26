const os = require('os');
const { contextBridge}  = require('electron');

globalThis.systemApi = {
  hostname: os.hostname(),
  platform: os.platform(),
  release: os.release(),
  type: os.type(),
  arch: os.arch(),
  uptime: os.uptime(),
  interfaces: os.networkInterfaces()
};

contextBridge.exposeInMainWorld('systemApi', systemApi);
