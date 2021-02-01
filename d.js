const { ipcRenderer } = require('electron')    
var remote = require('electron').remote

global.pinghost = () => {
  ipcRenderer.sendToHost(location.href)
}

