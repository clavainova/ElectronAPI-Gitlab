
const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
    on: (event, next) => ipcRenderer.on(event, next),
    send: (event, arg) => ipcRenderer.send(event, arg)
});