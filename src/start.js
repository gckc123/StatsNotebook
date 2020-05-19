const { dialog } = require('electron');
const fs = require('fs');
const electron = require('electron')
const app = electron.app
const path = require('path')
const isDev = require('electron-is-dev')
const BrowserWindow = electron.BrowserWindow

const zmq = require('zeromq')

let mainWindow = null; // #A

let RequestToR = zmq.socket('dealer');
let ReplyFromR = zmq.socket('router');

RequestToR.identity = "NodejsClient"

RequestToR.connect("tcp://localhost:5556");
ReplyFromR.bind("tcp://*:5555")

app.on('ready', () => {
  
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    show:false,
    width: 1366,
    height: 768,
  });
  //mainWindow.removeMenu()

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  )

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
  
  //mainWindow.loadFile('index.html');
});

ReplyFromR.on("message",function() {
  console.log("Received reply from R");
  var args = Array.apply(null, arguments);
  console.log(args[1].toString());
  showRReply(args[1].toString());
})

const getFileFromUser = exports.getFileFromUser = () => {
  const file = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openFile'],
    filters: [
        {name: 'CSV File', extensions: ['csv']},
        {name: 'SPSS File', extensions: ['sav']},
        {name: 'STATA File', extensions: ['dta']}
    ]
  });
  if (file) { sendFileName(file) }
}

const send2R = exports.send2R = (codes) => {
  console.log("Sending codes to R: ", codes);
  RequestToR.send(codes);
}

const sendFileName = (file) => {
  let directory = path.dirname(file[0])
  let filename = path.basename(file[0])
  let ext = path.extname(file[0])
  let os = process.platform
  mainWindow.webContents.send('file-opened', directory, filename, ext, os);
}

const showRReply = (reply) => {
  mainWindow.webContents.send('RecvROutput', reply)
}