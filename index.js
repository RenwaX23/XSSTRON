
var app  = require('electron').app
const session = require('electron').session;

const { BrowserWindow } = require('electron');
const { ipcRenderer } = require('electron')    
var remote = require('electron').remote





var mainWindow = null



app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {

  const filter = {
    urls: []
  }
  
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
if(details.method==='POST' && !(details.url.includes('#shetajyanmx')) && (details.webContentsId==2 || details.webContentsId==null) && details.requestHeaders["Content-Type"]=='application/x-www-form-urlencoded'){
 
    mainWindow.webContents.send('my-ipc-channel', details);
  };
    callback({ requestHeaders: details.requestHeaders })
  })

  const path = require('path');
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
  


  mainWindow = new BrowserWindow({ width: 1030, height: 720,icon: __dirname+'/build/1.ico', frame: false,
    webPreferences: {
  
      enableRemoteModule: true,
      nodeIntegration : true,
      webviewTag : true,
      contextIsolation: false

  }
  })

 
  
  mainWindow.loadURL('file://' + require('path').join(__dirname, 'browser.html'))
  mainWindow.on('closed', function() {
    mainWindow = null
  })


})

  