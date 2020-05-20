//Note to self:
//Window can use the following command in Package.json to set environmental variable
//”electron-dev”: "set ELECTRON_START_URL=http://localhost:3000 && electron .”
import React, {Component} from 'react';
import './App.css';
import {TopNavTabs} from './TopNavTabs';
import { Notebook } from './Notebook';
import {MediationPanel} from "./MediationPanel"
import { AnalysisPanelBar } from './AnalysisPanelBar';


const electron = window.require('electron');
const mainProcess = electron.remote.require('./start.js');
const ipcRenderer = electron.ipcRenderer;

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tentativeScript: "",
      ActiveScript: "",
      ActiveBlkID: "FirstBlk",
      CurrentVariableList: [],
      NotebookBlkList: [
        {
          NotebookBlkID: "FirstBlk",
          NotebookBlkScript: "",
          NotebookBlkROutput: [],
          NotebookBlkNote: "",
          Busy: false,
          Active: true,
        }
      ]
    };    
  }
  
  componentDidMount() {
    ipcRenderer.on('RecvROutput', (event, content) => {
      let ResultsJSON = JSON.parse(content)
      if (ResultsJSON.OutputType[0] === "Normal" || ResultsJSON.OutputType[0] === "Warning" || ResultsJSON.OutputType[0] === "Message" || ResultsJSON.OutputType[0] === "Error") {
        let tmp = this.state.NotebookBlkList.slice()
        let Reply2BlkIndex = this.state.NotebookBlkList.findIndex( (item) => item.NotebookBlkID === ResultsJSON.toBlk[0])
        if (Reply2BlkIndex >= 0)
        {
          tmp[Reply2BlkIndex].NotebookBlkROutput = [...tmp[Reply2BlkIndex].NotebookBlkROutput, {OutputType: ResultsJSON.OutputType,
            Output: ResultsJSON.Output}];
          this.setState({NotebookBlkList:[...tmp]})
        }
      }else if (ResultsJSON.OutputType[0] === "getVariableList") {
        
        this.setState({CurrentVariableList: ResultsJSON.Output})
      }
    })
    
    ipcRenderer.on('file-opened', (event, directory, filename, ext, os) => {
      if (os === "win32") {
        directory = directory.replace(/\\/g,"\\\\")
      }
      
      let script = `setwd("${directory}") \n`;
      switch (ext) {
        case ".csv":
        case ".CSV":
          script = script + `currentDataset <- read.csv("${filename}")`
          break;
        case ".sav":
        case ".SAV":
          script = script + `library(foreign)\ncurrentDataset <- read.spss("${filename}", 
          to.data.frame=TRUE, use.value.labels = FALSE)`
          break;
        case ".dta":
        case ".DTA":
          script = script + `library(foreign)\ncurrentDataset <- read.dta("${filename}")`
          break;
        default:
          break;
      }
      //Potential updating pitfall here??
      this.addExtraBlk(script, true)
         
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('RecvROutput')
    ipcRenderer.removeAllListeners('file-opened')
  }

  addExtraBlk = (script,runScript) => {
    let tmp = this.state.NotebookBlkList.slice()
    let CurrentActiveIndex = this.state.NotebookBlkList.findIndex( (item) => item.Active)
    if (CurrentActiveIndex >= 0) {
        tmp[CurrentActiveIndex].Active = false;
    }
    let randomID = Math.random().toString(36).substring(2, 15)
    if (runScript) {
        this.setState({ActiveBlkID: randomID,
        ActiveScript: script,
        NotebookBlkList: [...tmp, {NotebookBlkScript: script, 
          Active: true, 
          NotebookBlkID: randomID,
          NotebookBlkROutput: [],
          NotebookBlkNote: "",
          Busy: false
        }]}, () => this.runScript())
    }else{
        this.setState({ActiveBlkID: randomID,
          ActiveScript: script,
          NotebookBlkList: [...tmp, {NotebookBlkScript: script, 
            Active: true, 
            NotebookBlkID: randomID,
            NotebookBlkROutput: [],
            NotebookBlkNote: "",
            Busy: false
          }]})
    }  
  }

  gainFocus = (index) => {
    let tmp = this.state.NotebookBlkList.slice()
    let CurrentActiveIndex = this.state.NotebookBlkList.findIndex( (item) => item.Active)
    if (CurrentActiveIndex >= 0) {
        tmp[CurrentActiveIndex].Active = false;
    }
    tmp[index].Active = true;
    this.setState({ActiveScript: tmp[index].NotebookBlkScript})
    this.setState({ActiveBlkID: tmp[index].NotebookBlkID})
    this.setState({NotebookBlkList: [...tmp]})
  }

  delBlk = () => {
    let tmp = this.state.NotebookBlkList.filter( (item) => !item.Active)
    this.setState({NotebookBlkList: [...tmp]})
    this.setState({ActiveScript: ""})
    this.setState({ActiveBlkID: null})
  }

  updateAEditorValue = (index, newValue) => {
    let tmp = this.state.NotebookBlkList.slice()
    tmp[index].NotebookBlkScript = newValue
    this.setState({NotebookBlkList: [...tmp], ActiveScript: newValue})
  }

  getVariableList = () => {
    let ScriptJSON = {
      RequestType: "getVariableList",
      Script: "",
      fromBlk: "",
    }
    let StriptString = JSON.stringify(ScriptJSON)
    mainProcess.send2R(StriptString);
  }

  runScript = () => {  
    let tmp = this.state.NotebookBlkList.slice()
    let CurrentActiveIndex = this.state.NotebookBlkList.findIndex( (item) => item.Active)
    if (CurrentActiveIndex >= 0) {
      tmp[CurrentActiveIndex].NotebookBlkROutput = [];
      this.setState({NotebookBlkList: [...tmp]})
      let ScriptJSON = {
        RequestType: "RCode",
        Script: this.state.ActiveScript,
        fromBlk: this.state.ActiveBlkID,
      }
      let StriptString = JSON.stringify(ScriptJSON)
      mainProcess.send2R(StriptString);
    }
    this.getVariableList();
  }

  openFile = () => {
    mainProcess.getFileFromUser();
  }

  updateTentativeScript = (codeString) => {
    if (codeString !== this.state.tentativeScript) {
      this.setState({tentativeScript: codeString})
    }
  }
  
  render() {

      return (
          <div className="container-fluid p-2 flex-container">
            <TopNavTabs openFileCallback = {this.openFile}/>
            <div className="main-pane">
              <div className="left-pane p-2">
                <div hidden={false}>
                  <AnalysisPanelBar addExtraBlkCallback = {this.addExtraBlk}
                  runScriptCallback = {this.runScript}
                  tentativeScript = {this.state.tentativeScript}/>
                  <MediationPanel CurrentVariableList = {this.state.CurrentVariableList}
                  updateTentativeScriptCallback = {this.updateTentativeScript}
                  tentativeScript = {this.state.tentativeScript}/>
                </div>

              </div>
              <div className="right-pane p-2">
                  <Notebook
                    NotebookBlkList = {this.state.NotebookBlkList}
                    addExtraBlkCallback={this.addExtraBlk}
                    gainFocusCallback={this.gainFocus}
                    delBlkCallback = {this.delBlk}
                    updateAEditorValueCallback = {this.updateAEditorValue}
                    runScriptCallback={this.runScript}
                  />  
              </div>
            </div>
         </div>          
      )
  };
}


