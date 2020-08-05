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
    title: "PandaPIG",
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
  console.log(args)
  showRReply(args[1].toString('utf8'));
})

const getCPUCount = exports.getCPUCount = () => {
  let os = require('os')
  let cpuCount = os.cpus().length
  mainWindow.webContents.send('cpuCount', cpuCount);
}

const getFileFromUser = exports.getFileFromUser = (fileType) => {
  let fileTypeName = ""
  let fileExtension = ""
  switch (fileType) {
    case "CSV":
      fileTypeName = "CSV File"
      fileExtension = ["csv", "CSV"]
      break;
    case "SPSS":
      fileTypeName = "SPSS File"
      fileExtension = ["sav","SAV"]
      break;
    case "STATA":
      fileTypeName = "STATA File"
      fileExtension = ["dta","DTA"]
      break;
    case "Notebook":
      fileTypeName = "Notebook file"
      fileExtension = ["rnb", "RNB"]
      break;
    default:
      break;
  }
  const file = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openFile'],
    filters: [
        {name: fileType, extensions: fileExtension},
    ]
  });
  console.log("Opening file")
  if (file) { 
    if (fileType === "CSV" || fileType === "SPSS" || fileType === "STATA") {
      sendFileName(file) 
    }else{
      if (fileType === "Notebook") {
        let notebookContent = fs.readFileSync(file[0]).toString();
        mainWindow.webContents.send('notebook-file-opened', notebookContent);
      }
    }
  }
}

const savingFile = exports.savingFile = (content, workingDir) => {
  const file = dialog.showSaveDialogSync(mainWindow, {
    title: 'Save Notebook',
    filters: [
      {name: 'Notebook Files', extensions: ['rnb']}
    ]
  });
  if (!file) 
  {
    console.log("Cannot write to file.")
    return
  };
  fs.writeFileSync(file, content);
}

const send2R = exports.send2R = (codes) => {
  console.log("Before replacement", codes)
  codes = codes.replace(/\\r\\n/g,"\\n").replace(/\\r/g,"\\n")
  console.log("Sending codes to R: ", codes);
  RequestToR.send(codes);
}

const sendFileName = (file) => {
  let directory = path.dirname(file[0])
  let filename = path.basename(file[0])
  let ext = path.extname(file[0])
  let os = process.platform
  mainWindow.webContents.send('data-file-opened', directory, filename, ext, os);
}

const showRReply = (reply) => {
  mainWindow.webContents.send('RecvROutput', reply)
}
