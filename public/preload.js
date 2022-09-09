const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    
    RecvROutput: (callback) => ipcRenderer.on('RecvROutput', callback),
    data_file_opened: (callback) => ipcRenderer.on('data-file-opened', callback),
    data_file_saved: (callback) => ipcRenderer.on('data-file-saved', callback),
    notebook_file_opened: (callback) => ipcRenderer.on('notebook-file-opened', callback),
    cpuCount: (callback) => ipcRenderer.on('cpuCount', callback),
    NotebookPath: (callback) => ipcRenderer.on('NotebookPath', callback),

    savingDataFile: (fileType) => ipcRenderer.send('savingDataFile', fileType),
    savingFile: (file) => ipcRenderer.send('savingFile', file),
    send2R: (ScriptString) => ipcRenderer.send('send2R', ScriptString),
    getCPUCount: () => ipcRenderer.send('getCPUCount', ""),
    getFileFromUser: (fileType) => ipcRenderer.send('getFileFromUser', fileType),
    openWebpage: (address) => ipcRenderer.send('openWebpage', address),

})