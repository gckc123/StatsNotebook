const { dialog } = require('electron');
const fs = require('fs');
const electron = require('electron')
const app = electron.app
const path = require('path')
const isDev = require('electron-is-dev')
const BrowserWindow = electron.BrowserWindow

const zmq = require('zeromq');
const { exec } = require('child_process');
const { shell } = require('electron');

let mainWindow = null; // #A

let RequestToR = zmq.socket('dealer');
let ReplyFromR = zmq.socket('router');

RequestToR.identity = "NodejsClient"

RequestToR.connect("tcp://localhost:5556");
ReplyFromR.bind("tcp://*:5555")


app.on('ready', () => {
  
  mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: false
    },
    show:false,
    width: 1366,
    height: 768,
    title: "PandaPIG3000",
  });

  if (!isDev) {
    mainWindow.removeMenu()
  }

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../index.html')}`,
  )

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    let RPath = (isDev? path.join(__dirname, '../extraResources/R/bin/R') : path.join(process.resourcesPath, 'extraResources/R/bin/R'))

    let start_server = ""
    if (process.platform === "win32")
    {
      start_server = "echo StatsNotebookServer::start_server()"
    }else if (process.platform === "darwin") {
      start_server = "echo \"StatsNotebookServer::start_server()\""
    }

    exec(start_server + "|\""+ RPath +"\" --no-save", (err, stdout, stderr) => {
      if (err) {
        console.log(err)
        console.log("Unable to start R.")
        
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      
    })

  })

  mainWindow.on('close', () => {
    let CloseRCode = {
      RequestType: "RCode",
      Script: "off",
      fromBlk: ""
    }
    let CodeString = JSON.stringify(CloseRCode)
    send2R(CodeString)
    //console.log("sending code to shut down R.")
  })

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
  
  //mainWindow.loadFile('index.html');
});

ReplyFromR.on("message",function() {
  //console.log("Received reply from R");
  var args = Array.apply(null, arguments);
  //console.log(args)
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
      sendFileName(file, "open") 
    }else{
      if (fileType === "Notebook") {
        let notebookContent = fs.readFileSync(file[0]).toString();
        mainWindow.webContents.send('notebook-file-opened', notebookContent);
        mainWindow.webContents.send('NotebookPath', file[0]);
      }
    }
  }
}

const savingFile = exports.savingFile = (content, NotebookPath = "") => {
  let file = ""
  if (NotebookPath === "") {
    file = dialog.showSaveDialogSync(mainWindow, {
    title: 'Save Notebook',
    filters: [
      {name: 'Notebook File', extensions: ['rnb']}
    ]
  });
  }else {
    file = NotebookPath
  }
  if (!file) 
  {
    console.log("Cannot write to file.")
    return
  };
  fs.writeFileSync(file, content);
  mainWindow.webContents.send('NotebookPath', file)
}

const openWebpage = exports.openWebpage = (address) => {
  shell.openExternal(address)
}

const savingDataFile = exports.savingDataFile = (fileType, workingDir) => {
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
  const file = dialog.showSaveDialogSync(mainWindow, {
    title: 'Save Data File as ' + fileType,
    filters: [
      {name: fileType, extensions: fileExtension}
    ]
  });
  if (!file) 
  {
    console.log("Cannot write to file.")
    return
  }else {
    sendFileName(file, "save") 
  };
  
}

const send2R = exports.send2R = (codes) => {
  //console.log("Before replacement", codes)
  codes = codes.replace(/\\r\\n/g,"\\n").replace(/\\r/g,"\\n")
  //console.log("Sending codes to R: ", codes);
  RequestToR.send(codes);
}

const sendFileName = (file, action = "open") => {
  let directory = ""
  let filename = ""
  let ext = ""
  if (action === "open") {
    directory = path.dirname(file[0])
    filename = path.basename(file[0])
    ext = path.extname(file[0])
  }else
  {
    directory = path.dirname(file)
    filename = path.basename(file)
    ext = path.extname(file)
  }
  let os = process.platform
  if (action === "open") {
    mainWindow.webContents.send('data-file-opened', directory, filename, ext, os);
  }else{
    mainWindow.webContents.send('data-file-saved', directory, filename, ext, os);
  }
}

const showRReply = (reply) => {
  mainWindow.webContents.send('RecvROutput', reply)
}

