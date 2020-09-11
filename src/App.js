//Note to self:
//Window can use the following command in Package.json to set environmental variable
//”electron-dev”: "set ELECTRON_START_URL=http://localhost:3000 && electron .”
import React, {Component} from 'react';
import './App.css';
import { TopNavTabs } from './TopNavTabs';
import { Notebook } from './Notebook';
import { MediationPanel } from "./MediationPanel"
import { AnalysisPanelBar } from './AnalysisPanelBar';
import { DataPanel} from './DataPanel';
import { NMAPanel } from './NMAPanel';
import { MAPanel } from './MAPanel';
import { MIPanel } from './MIPanel';
import { VarsReferencePanel } from './VarsReferencePanel';
import { RegPanel } from './RegPanel';
import { DescriptivePanel } from './DescriptivePanel';
import { CrosstabPanel } from './CrosstabPanel';
import { ComputePanel } from './ComputePanel';
import { FilterPanel } from './FilterPanel';
import { RecodePanel } from './RecodePanel';
import { ANOVAPanel } from './ANOVAPanel';
import { IndependentTTestPanel } from './IndependentTTestPanel';
import { DependentTTestPanel } from './DependentTTestPanel';
import { HistogramPanel } from './HistogramPanel';
import { DensityPanel } from './DensityPanel';
import { BoxplotPanel } from './BoxplotPanel';
import { BarChartPanel } from './BarChartPanel';
import { ScatterplotPanel } from './ScatterplotPanel';
import { CorrelogramPanel } from './CorrelogramPanel';
import { LineGraphPanel } from './LineGraphPanel';
import _ from "lodash";
import { HotKeys } from "react-hotkeys";

const keyMap = {
    ADD: "alt+a"
}

const electron = window.require('electron');
const mainProcess = electron.remote.require('../electron/start.js');
const ipcRenderer = electron.ipcRenderer;

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tentativeScript: "",
      ActiveScript: "",
      ActiveBlkID: null,
      CurrentVariableList: {},
      CategoricalVarLevels: {},
      CurrentData: [],
      imputedDataset: false,
      nrow: 0,
      ncol: 0,
      CPU: 1,
      NotebookBlkList: [],
      currentActiveAnalysisPanel: "",
      currentActiveDataPanel: "",
      currentActiveDataVizPanel: "",
      currentActiveLeftPanel: "",
      dataPanelWidth: 100,
      dataPanelHeight: 100,
      tentativePanelState: {},
      setPanelFromNotebook: false,
    }
    this.DataPanelContainerRef = React.createRef();        
  }
  
  componentDidMount() {
    this.updateDataPanelDimension();
    window.addEventListener("resize", this.updateDataPanelDimension);

    let initialScript = "library(tidyverse)\nlibrary(ggplot2)\nlibrary(forcats)\n"
    this.addExtraBlk(initialScript, true)

    ipcRenderer.on('RecvROutput', (event, content) => {
      let ResultsJSON = JSON.parse(content.toString())
      
      if (ResultsJSON.OutputType[0] === "Normal" || ResultsJSON.OutputType[0] === "Warning" || ResultsJSON.OutputType[0] === "Message" || ResultsJSON.OutputType[0] === "Error") {
        //let tmp = this.state.NotebookBlkList.slice()
        let tmp = _.cloneDeep(this.state.NotebookBlkList)
        let Reply2BlkIndex = this.state.NotebookBlkList.findIndex( (item) => item.NotebookBlkID === ResultsJSON.toBlk[0])
        if (Reply2BlkIndex >= 0)
        {
          tmp[Reply2BlkIndex].NotebookBlkROutput = [...tmp[Reply2BlkIndex].NotebookBlkROutput, {OutputType: ResultsJSON.OutputType,
            Output: ResultsJSON.Output}];
          this.setState({NotebookBlkList:[...tmp]})
          
        }
      }else if (ResultsJSON.OutputType[0] === "getVariableList") {  
        let imputedDataset = false
        if (Object.keys(ResultsJSON.Output).findIndex((item) => item === ".imp") !== -1) {
          imputedDataset = true
        }
        this.setState({CurrentVariableList: ResultsJSON.Output,
          CategoricalVarLevels: ResultsJSON.CategoricalVarLevels,
          imputedDataset: imputedDataset})
      }else if (ResultsJSON.OutputType[0] === "getData") {
        this.setState({CurrentData: ResultsJSON.Output, nrow: ResultsJSON.nrow[0], ncol: ResultsJSON.ncol[0]})
      }else if(ResultsJSON.OutputType[0] === "END") {
        let tmp = _.cloneDeep(this.state.NotebookBlkList)
        let Reply2BlkIndex = this.state.NotebookBlkList.findIndex( (item) => item.NotebookBlkID === ResultsJSON.toBlk[0])
        if (Reply2BlkIndex >= 0)
        {
          tmp[Reply2BlkIndex].Busy = false
          tmp[Reply2BlkIndex].NotebookBlkROutput = [...tmp[Reply2BlkIndex].NotebookBlkROutput, {OutputType: ["Normal"],
            Output: ["--- End Of Execution ---"]}];
          this.setState({NotebookBlkList:[...tmp]})
        }
      }else if(ResultsJSON.OutputType[0] === "Graphics") {
        let tmp = _.cloneDeep(this.state.NotebookBlkList)
        let Reply2BlkIndex = this.state.NotebookBlkList.findIndex( (item) => item.NotebookBlkID === ResultsJSON.toBlk[0])
        if (Reply2BlkIndex >= 0)
        {
          tmp[Reply2BlkIndex].NotebookBlkROutput = [...tmp[Reply2BlkIndex].NotebookBlkROutput, {OutputType: ResultsJSON.OutputType,
            Output: ResultsJSON.Output}];
          this.setState({NotebookBlkList:[...tmp]})
        }
      }
    })
    
    ipcRenderer.on('data-file-opened', (event, directory, filename, ext, os) => {
      
      if (os === "win32") {
        directory = directory.replace(/\\/g,"\\\\")
      }
      
      let script = `setwd("${directory}") \n`;
      switch (ext) {
        case ".csv":
        case ".CSV":
          script = script + "library(tidyverse)\n"
          script = script + `currentDataset <- read_csv("${filename}")`
          break;
        case ".sav":
        case ".SAV":
          script = script + "library(tidyverse)\nlibrary(haven)\n"
          script = script + `currentDataset <- read_sav("${filename}")`
          break;
        case ".dta":
        case ".DTA":
          script = script + `library(tidyverse)\nlibrary(haven)\ncurrentDataset <- read_dta("${filename}")`
          break;
        default:
          break;
      }
      this.addExtraBlk(script, true) 
    })

    ipcRenderer.on('data-file-saved', (event, directory, filename, ext, os) => {
      
      if (os === "win32") {
        directory = directory.replace(/\\/g,"\\\\")
      }
      
      let script = `setwd("${directory}") \n`;
      switch (ext) {
        case ".csv":
        case ".CSV":
          script = script + "library(tidyverse)\n"
          script = script + `write_csv(currentDataset, "${filename}")`
          break;
        case ".sav":
        case ".SAV":
          script = script + "library(tidyverse)\nlibrary(haven)\n"
          script = script + `write_sav(currentDataset, "${filename}")`
          break;
        case ".dta":
        case ".DTA":
          script = script + `library(tidyverse)\nlibrary(haven)\nwrite_dta(currentDataset, "${filename}")`
          break;
        default:
          break;
      }
      this.addExtraBlk(script, true) 
    })

    ipcRenderer.on('notebook-file-opened', (event, notebookContent) => {
      let contentJSON = JSON.parse(notebookContent)
      this.setState({NotebookBlkList: contentJSON, ActiveBlkID: null, ActiveScript: ""})
    })

    ipcRenderer.on('cpuCount', (event, cpuCount) => {
      if (cpuCount >= 2)
        this.setState({CPU: cpuCount - 1})
    })

  }

  resetDataState = () => {
    this.setState({
      CurrentVariableList: {},
      CategoricalVarLevels: {},
      CurrentData: [],
      imputedDataset: false,
      nrow: 0,
      ncol: 0,
    })
  }

  updateDataPanelDimension = () => {
    if (this.DataPanelContainerRef.current) {
      this.setState({
        dataPanelHeight: this.DataPanelContainerRef.current.offsetHeight - 40,
        dataPanelWidth: this.DataPanelContainerRef.current.offsetWidth - 20,
      })
    }
  }

  reorderNotebookBlk = (direction) => {
    let NotebookBlkObj = _.cloneDeep(this.state.NotebookBlkList)
    let CurrentActiveIndex = NotebookBlkObj.findIndex( (item) => item.NotebookBlkID === this.state.ActiveBlkID)
    if (direction === "Up") {
      if (CurrentActiveIndex > 0) {
        let tmpNotebookBlk = {...NotebookBlkObj[CurrentActiveIndex - 1]}
        NotebookBlkObj[CurrentActiveIndex - 1] = {...NotebookBlkObj[CurrentActiveIndex]}
        NotebookBlkObj[CurrentActiveIndex] = {...tmpNotebookBlk}
        this.setState({NotebookBlkList : [...NotebookBlkObj]})
      }
    }else if (direction === "Down") {
      if (CurrentActiveIndex < NotebookBlkObj.length-1) {
        let tmpNotebookBlk = {...NotebookBlkObj[CurrentActiveIndex + 1]}
        NotebookBlkObj[CurrentActiveIndex + 1] = {...NotebookBlkObj[CurrentActiveIndex]}
        NotebookBlkObj[CurrentActiveIndex] = {...tmpNotebookBlk}
        this.setState({NotebookBlkList: [...NotebookBlkObj]})
      }
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('RecvROutput')
    ipcRenderer.removeAllListeners('data-file-opened')
    ipcRenderer.removeAllListeners('notebook-file-opened')
    ipcRenderer.removeAllListeners('cpuCount')
    window.removeEventListener('resize', this.updateDataPanelDimension)
  }

  selectLeftPanel = (panel) => {
    this.setState({currentActiveLeftPanel: panel})
    switch (panel) {
      case "DataPanel":
        this.setState({currentActiveDataPanel: panel, currentActiveAnalysisPanel: "", currentActiveDataVizPanel: ""})
        break;
      case "AnalaysisPanel":
        this.setState({currentActiveDataPanel: "", currentActiveDataVizPanel: ""})
        break;
      case "DataVizPanel":
        this.setState({currentActiveDataPanel: "", currentActiveAnalysisPanel: ""})
        break;
      default:
        break;
    }
  }

  selectDataPanel = (panel) => {
    this.setState({currentActiveDataPanel: panel})
  }

  selectAnalysisPanel = (panel) => {
    this.setState({currentActiveAnalysisPanel: panel})
  }

  selectDataVizPanel = (panel) => {
    this.setState({currentActiveDataVizPanel: panel})
  }

  savingDataFile = (fileType, workingDir) => {
    mainProcess.savingDataFile(fileType)
  }

  savingFile = () => {
    mainProcess.savingFile(JSON.stringify(this.state.NotebookBlkList));
  }

  addExtraBlk = (script,runScript, fromLeftPanel = "", fromPanel = "") => {
    let tmp = _.cloneDeep(this.state.NotebookBlkList)
    let randomID = Math.random().toString(36).substring(2, 15)
    let genScript = ""
    if (fromLeftPanel !== "") {
      genScript = script
    }
    let updatedNotebookBlkList = [...tmp, {NotebookBlkScript: script, 
      NotebookBlkID: randomID,
      NotebookBlkROutput: [],
      NotebookBlkNote: "",
      Busy: false,
      showEditor: false,
      editorHTML: "",
      Expanded: true,
      Title: "--- Analysis Title Here ---",
      fromLeftPanel: fromLeftPanel,
      fromPanel: fromPanel,
      selected: false,
      //panelState: JSON.parse(JSON.stringify(this.state.tentativePanelState)),
      panelState: _.cloneDeep(this.state.tentativePanelState),
      genScript: genScript,
      varState: {...this.state.CurrentVariableList},
      needUpdate: false
    }]
    if (runScript) {
        this.setState({ActiveBlkID: randomID,
        ActiveScript: script,
        NotebookBlkList: [...updatedNotebookBlkList]}, () => this.runScript())
    }else{
        this.setState({ActiveBlkID: randomID,
          ActiveScript: script,
          NotebookBlkList: [...updatedNotebookBlkList]})
    }  
    console.log(this.state.NotebookBlkList)
  }

  gainFocus = (index) => {
    let tmp = _.cloneDeep(this.state.NotebookBlkList)
    this.setState({ActiveScript: tmp[index].NotebookBlkScript, ActiveBlkID: tmp[index].NotebookBlkID})
  }

  mergeBlk = () => {
    let tmp = _.cloneDeep(this.state.NotebookBlkList)
    let selectedBlk = this.state.NotebookBlkList.filter((item) => item.selected)
    let ActiveScript = ""
    let ActiveBlkID = "'"

    if (selectedBlk.length >= 2) {
      let combinedScript = ""
      let combinedEditorHTML = ""
      let combinedNotebookBlkROutput = []
      selectedBlk.forEach((blk, index) => {
        combinedScript = combinedScript + "\n\n## Merged from block " + index+ " ##\n\n" + blk.NotebookBlkScript
        combinedEditorHTML = combinedEditorHTML + "<p><br>MERGE FROM BLOCK "+ index +"<br><p>" + blk.editorHTML
        combinedNotebookBlkROutput = combinedNotebookBlkROutput.concat(blk.NotebookBlkROutput)
        console.log("Merging")
        console.log(combinedScript)
      })

      let add2BlkIndex = this.state.NotebookBlkList.findIndex((blk) => blk.selected)
      tmp[add2BlkIndex].selected = false
      tmp[add2BlkIndex].NotebookBlkScript = combinedScript
      tmp[add2BlkIndex].NotebookBlkROutput = combinedNotebookBlkROutput
      tmp[add2BlkIndex].editorHTML = combinedEditorHTML
      tmp[add2BlkIndex].needUpdate = true
      ActiveScript = tmp[add2BlkIndex].NotebookBlkScript
      ActiveBlkID = tmp[add2BlkIndex].NotebookBlkID

      tmp = tmp.filter((blk) => !blk.selected)
      this.setState({NotebookBlkList: [...tmp], ActiveBlkID: ActiveBlkID, ActiveScript: ActiveScript})
    }

    
    
    
  }

  setNotebookBlkUpdate2False = (index) => {
    let tmp = _.cloneDeep(this.state.NotebookBlkList)
    tmp[index].needUpdate = false
    this.setState({NotebookBlkList: [...tmp]})
  }

  delBlk = () => {
    let tmp = this.state.NotebookBlkList.filter( (item) => !item.selected)
    this.setState({NotebookBlkList: [...tmp], ActiveScript: "", ActiveBlkID: null})
  }

  updateNotebookBlkState = (index, script, title, editorHTML) => {
    let tmp = _.cloneDeep(this.state.NotebookBlkList)
    tmp[index].Title = title
    tmp[index].NotebookBlkScript = script
    tmp[index].editorHTML = editorHTML
    this.setState({NotebookBlkList: [...tmp]})
  }

  toggleTEditor = (index) => {
    let tmp = _.cloneDeep(this.state.NotebookBlkList)
    tmp[index].showEditor = !tmp[index].showEditor
    this.setState({NotebookBlkList: [...tmp]})
  }

  toggleNotebookBlk = (index) => {
    let tmp = _.cloneDeep(this.state.NotebookBlkList)
    tmp[index].Expanded = !tmp[index].Expanded
    this.setState({NotebookBlkList: [...tmp]})
  }

  updateAEditorValue = (index, newValue, execute) => {
    let tmp = _.cloneDeep(this.state.NotebookBlkList)
    tmp[index].NotebookBlkScript = newValue
    if (execute) {
      this.setState({NotebookBlkList: [...tmp], ActiveScript: newValue, ActiveBlkID: tmp[index].NotebookBlkID}, () => this.runScript())  
    }else
    {
      this.setState({NotebookBlkList: [...tmp], ActiveScript: newValue, ActiveBlkID: tmp[index].NotebookBlkID})
    }
  }

  selectNotebookBlk = (index) => {
    let tmp = _.cloneDeep(this.state.NotebookBlkList)
    tmp[index].selected = !tmp[index].selected
    this.setState({NotebookBlkList: [...tmp]})
  }

  getData = () => {
    let ScriptJSON = {
      RequestType: "getData",
      Script: "",
      fromBlk: "",
      startIndex: 1,
      endIndex: 500,
    }
    let ScriptString = JSON.stringify(ScriptJSON)
    mainProcess.send2R(ScriptString);
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

  getCPUCount = () => {
    mainProcess.getCPUCount();
  }

  runScript = (fromNotebookBlk = false) => {  
    let tmp = _.cloneDeep(this.state.NotebookBlkList)
    let need2ResetDataState = false
    let selectedBlk = []
    let multipleBlk = false
    let incActiveBlk = false
    
    if (fromNotebookBlk) {
      selectedBlk = this.state.NotebookBlkList.filter((item) => item.selected)
      if (selectedBlk.length > 0) {
        multipleBlk = true
      }

      if (selectedBlk.findIndex((item) => item.NotebookBlkID === this.state.ActiveBlkID) === -1) {
        incActiveBlk = true
      }
    }

    if (multipleBlk) {
      selectedBlk.forEach((blk) => {
        let currentIndex = this.state.NotebookBlkList.findIndex((item) => item.NotebookBlkID === blk.NotebookBlkID)
        tmp[currentIndex].NotebookBlkROutput = [];
        tmp[currentIndex].Busy = true;
        tmp[currentIndex].selected = false;

        let ScriptJSON = {
          RequestType: "RCode",
          Script: blk.NotebookBlkScript,
          fromBlk: blk.NotebookBlkID,
        }

        let regex = /currentDataset <- read_csv\(|currentDataset <- read_sav\(|currentDataset <- read_dta\(/;
        if (ScriptJSON.Script.match(regex)) {
          need2ResetDataState = true          
        }

        let StriptString = JSON.stringify(ScriptJSON)
        mainProcess.send2R(StriptString);
      })
    }
    
    if(!multipleBlk || incActiveBlk){
      let CurrentActiveIndex = this.state.NotebookBlkList.findIndex( (item) => item.NotebookBlkID === this.state.ActiveBlkID)
      if (CurrentActiveIndex >= 0) {
        tmp[CurrentActiveIndex].NotebookBlkROutput = [];
        tmp[CurrentActiveIndex].Busy = true;
        
        let ScriptJSON = {
          RequestType: "RCode",
          Script: this.state.ActiveScript,
          fromBlk: this.state.ActiveBlkID,
        }

        let regex = /currentDataset <- read_csv\(|currentDataset <- read_sav\(|currentDataset <- read_dta\(/;
        if (ScriptJSON.Script.match(regex)) {
          need2ResetDataState = true          
        }

        let StriptString = JSON.stringify(ScriptJSON)
        mainProcess.send2R(StriptString);
      }
    }
    this.setState({NotebookBlkList: [...tmp]})
    if (need2ResetDataState) {
      this.resetDataState()
    }
    this.getVariableList();
    this.getData();
  }

  openFile = (fileType) => {
    mainProcess.getFileFromUser(fileType);
    this.setState({currentActiveLeftPanel: "DataPanel", currentActiveDataPanel: "DataPanel"})
  }

  updateTentativeScript = (codeString, panelState = {}) => {
    if (codeString !== this.state.tentativeScript || JSON.stringify(panelState) !== JSON.stringify(this.state.tentativePanelState)) {
      this.setState({tentativeScript: codeString, tentativePanelState: _.cloneDeep(panelState)})
    }
  }
  
  setPanelFromNotebookToFalse = () => {
    this.setState({setPanelFromNotebook: false}, () => console.log("Set to FALSE!"))
  }

  restorePanelSetting = (index) => {
    
    let tmp = _.cloneDeep(this.state.NotebookBlkList)
 
    switch (tmp[index].fromLeftPanel) {
      case "AnalysisPanel":
        this.setState({
          currentActiveLeftPanel: tmp[index].fromLeftPanel,
          currentActiveAnalysisPanel: tmp[index].fromPanel,
          currentActiveDataPanel: "",
          currentActiveDataVizPanel: "",
          tentativePanelState: {...tmp[index].panelState},
          tentativeScript: tmp[index].genScript,
          setPanelFromNotebook: true,
        })
        break;
      case "DataVizPanel":
        this.setState({
          currentActiveLeftPanel: tmp[index].fromLeftPanel,
          currentActiveDataVizPanel: tmp[index].fromPanel,
          currentActiveDataPanel: "",
          currentActiveAnalysisPanel: "",
          tentativePanelState: {...tmp[index].panelState},
          tentativeScript: tmp[index].genScript,
          setPanelFromNotebook: true,
        })
        break;
      default:
        break;
    }
  }

  newNotebook = () => {
    console.log("New Notebook")
    this.setState({tentativeScript: "", ActiveScript: "", NotebookBlkList: []})
  }

  render() {

      return (
          <div className="container-fluid p-2 flex-container">
            <TopNavTabs openFileCallback = {this.openFile}
            selectLeftPanelCallback = {this.selectLeftPanel}
            selectAnalysisPanelCallback = {this.selectAnalysisPanel}
            selectDataPanelCallback = {this.selectDataPanel}
            selectDataVizPanelCallback = {this.selectDataVizPanel}
            savingFileCallback = {this.savingFile}
            getCPUCountCallback = {this.getCPUCount}
            newNotebookCallback = {this.newNotebook}
            addExtraBlkCallback = {this.addExtraBlk}
            savingDataFileCallback = {this.savingDataFile}/>
            
            <div className="main-pane">
              <div className="left-pane pl-2 pr-2 mb-2" ref={this.DataPanelContainerRef}>
                
                <div hidden={this.state.currentActiveLeftPanel !== "DataPanel"}>
                  {this.state.currentActiveLeftPanel === "DataPanel" &&
                  <>
                  <div hidden={this.state.currentActiveDataPanel !== "DataPanel"}>
                    <DataPanel CurrentData = {this.state.CurrentData}
                    CurrentVariableList = {this.state.CurrentVariableList}
                    nrow = {this.state.nrow}
                    ncol = {this.state.ncol}
                    dataPanelHeight = {this.state.dataPanelHeight}
                    dataPanelWidth = {this.state.dataPanelWidth}
                    addExtraBlkCallback = {this.addExtraBlk}/>
                    <div style={{fontSize: "12px", paddingTop: "2px"}}>** This is a data preview. Only the first 500 rows are shown.</div>
                  </div>
                  
                  <div hidden={this.state.currentActiveDataPanel !== "VarsReferencePanel"}>
                    <VarsReferencePanel CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    CurrentVariableList = {this.state.CurrentVariableList}
                    nrow = {Object.keys(this.state.CategoricalVarLevels).length+1}
                    ncol = {this.state.ncol}
                    dataPanelHeight = {this.state.dataPanelHeight}
                    dataPanelWidth = {this.state.dataPanelWidth}
                    addExtraBlkCallback = {this.addExtraBlk}/>
                  </div>

                  <div hidden={this.state.currentActiveDataPanel !== "ComputePanel"}>
                    <ComputePanel CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    CurrentVariableList = {[Object.keys(this.state.CurrentVariableList), Object.keys(this.state.CurrentVariableList).sort()]}
                    ncol = {this.state.ncol}
                    dataPanelHeight = {this.state.dataPanelHeight}
                    dataPanelWidth = {this.state.dataPanelWidth}
                    addExtraBlkCallback = {this.addExtraBlk}
                    runScriptCallback = {this.runScript}/>
                  </div>
                  </>
                  }
                  <div hidden={this.state.currentActiveDataPanel !== "FilterPanel"}>
                    <FilterPanel CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    CurrentVariableList = {[Object.keys(this.state.CurrentVariableList), Object.keys(this.state.CurrentVariableList).sort()]}
                    ncol = {this.state.ncol}
                    dataPanelHeight = {this.state.dataPanelHeight}
                    dataPanelWidth = {this.state.dataPanelWidth}
                    addExtraBlkCallback = {this.addExtraBlk}
                    runScriptCallback = {this.runScript}/>
                  </div>

                  <div hidden={this.state.currentActiveDataPanel !== "RecodePanel"}>
                    <RecodePanel CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    CurrentVariableList = {[Object.keys(this.state.CurrentVariableList), Object.keys(this.state.CurrentVariableList).sort()]}
                    ncol = {this.state.ncol}
                    dataPanelHeight = {this.state.dataPanelHeight}
                    dataPanelWidth = {this.state.dataPanelWidth}
                    addExtraBlkCallback = {this.addExtraBlk}
                    runScriptCallback = {this.runScript}/>
                  </div>

                </div>
                
                <div hidden={this.state.currentActiveLeftPanel !== "AnalysisPanel"}>
                  <div className="notebook-bar">
                  <AnalysisPanelBar addExtraBlkCallback = {this.addExtraBlk}
                  runScriptCallback = {this.runScript}
                  tentativeScript = {this.state.tentativeScript}
                  currentActiveLeftPanel = {this.state.currentActiveLeftPanel}
                  currentActiveDataVizPanel = {this.state.currentActiveDataVizPanel}
                  currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}/>
                  </div>

                  <div hidden={this.state.currentActiveAnalysisPanel !== "MediationPanel"}>
                    <MediationPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}
                    CPU = {this.state.CPU}/>
                  </div>

                  <div hidden={this.state.currentActiveAnalysisPanel !== "NMAPanel"}>
                    <NMAPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                  <div hidden={this.state.currentActiveAnalysisPanel !== "MAPanel"}>
                    <MAPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                  <div hidden={this.state.currentActiveAnalysisPanel !== "MIPanel"}>
                    <MIPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    CPU = {this.state.CPU}
                    currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                  <div hidden={this.state.currentActiveAnalysisPanel !== "LRPanel" &&
                  this.state.currentActiveAnalysisPanel !== "LogitPanel" &&
                  this.state.currentActiveAnalysisPanel !== "PoiPanel" &&
                  this.state.currentActiveAnalysisPanel !== "NbPanel" &&
                  this.state.currentActiveAnalysisPanel !== "MultinomPanel"}>
                    <RegPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}
                    imputedDataset = {this.state.imputedDataset}
                    CPU = {this.state.CPU}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                  <div hidden={this.state.currentActiveAnalysisPanel !== "DescriptivePanel"}>
                    <DescriptivePanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}
                    imputedDataset = {this.state.imputedDataset}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                  <div hidden={this.state.currentActiveAnalysisPanel !== "CrosstabPanel"}>
                    <CrosstabPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}
                    imputedDataset = {this.state.imputedDataset}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>
                  
                  <div hidden={this.state.currentActiveAnalysisPanel !== "ANOVAPanel"}>
                    <ANOVAPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}
                    imputedDataset = {this.state.imputedDataset}
                    CPU = {this.state.CPU}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                  <div hidden={this.state.currentActiveAnalysisPanel !== "IndependentTTestPanel"}>
                    <IndependentTTestPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}
                    imputedDataset = {this.state.imputedDataset}
                    CPU = {this.state.CPU}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                  <div hidden={this.state.currentActiveAnalysisPanel !== "DependentTTestPanel"}>
                    <DependentTTestPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}
                    imputedDataset = {this.state.imputedDataset}
                    CPU = {this.state.CPU}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>
                </div>
                
                <div hidden={this.state.currentActiveLeftPanel !== "DataVizPanel"}>
                  <div className="notebook-bar">
                  <AnalysisPanelBar addExtraBlkCallback = {this.addExtraBlk}
                  runScriptCallback = {this.runScript}
                  tentativeScript = {this.state.tentativeScript}
                  currentActiveLeftPanel = {this.state.currentActiveLeftPanel}
                  currentActiveDataVizPanel = {this.state.currentActiveDataVizPanel}
                  currentActiveAnalysisPanel = {this.state.currentActiveAnalysisPanel}/>
                  </div>

                  <div hidden={this.state.currentActiveDataVizPanel !== "HistogramPanel"}>
                    <HistogramPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveDataVizPanel = {this.state.currentActiveDataVizPanel}
                    imputedDataset = {this.state.imputedDataset}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>
                  
                  <div hidden={this.state.currentActiveDataVizPanel !== "DensityPanel"}>
                    <DensityPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveDataVizPanel = {this.state.currentActiveDataVizPanel}
                    imputedDataset = {this.state.imputedDataset}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                  <div hidden={this.state.currentActiveDataVizPanel !== "BoxplotPanel"}>
                    <BoxplotPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveDataVizPanel = {this.state.currentActiveDataVizPanel}
                    imputedDataset = {this.state.imputedDataset}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                  <div hidden={this.state.currentActiveDataVizPanel !== "BarChartPanel"}>
                    <BarChartPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveDataVizPanel = {this.state.currentActiveDataVizPanel}
                    imputedDataset = {this.state.imputedDataset}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                  <div hidden={this.state.currentActiveDataVizPanel !== "ScatterplotPanel"}>
                    <ScatterplotPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveDataVizPanel = {this.state.currentActiveDataVizPanel}
                    imputedDataset = {this.state.imputedDataset}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                  <div hidden={this.state.currentActiveDataVizPanel !== "CorrelogramPanel"}>
                    <CorrelogramPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveDataVizPanel = {this.state.currentActiveDataVizPanel}
                    imputedDataset = {this.state.imputedDataset}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>
                  
                  <div hidden={this.state.currentActiveDataVizPanel !== "LineGraphPanel"}>
                    <LineGraphPanel CurrentVariableList = {this.state.CurrentVariableList}
                    CategoricalVarLevels = {this.state.CategoricalVarLevels}
                    updateTentativeScriptCallback = {this.updateTentativeScript}
                    tentativeScript = {this.state.tentativeScript}
                    addExtraBlkCallback = {this.addExtraBlk}
                    currentActiveDataVizPanel = {this.state.currentActiveDataVizPanel}
                    imputedDataset = {this.state.imputedDataset}
                    setPanelFromNotebook = {this.state.setPanelFromNotebook}
                    tentativePanelState = {this.state.tentativePanelState}
                    setPanelFromNotebookToFalseCallback = {this.setPanelFromNotebookToFalse}/>
                  </div>

                </div>

              </div>
              <div className="right-pane pl-2 pr-2 mb-2"><HotKeys keyMap={keyMap} handlers={{ADD: event => this.addExtraBlk("",false)}}>
                  <Notebook
                    NotebookBlkList = {this.state.NotebookBlkList}
                    addExtraBlkCallback={this.addExtraBlk}
                    gainFocusCallback={this.gainFocus}
                    delBlkCallback = {this.delBlk}
                    mergeBlkCallback = {this.mergeBlk}
                    reorderNotebookBlkCallback = {this.reorderNotebookBlk}
                    updateAEditorValueCallback = {this.updateAEditorValue}
                    runScriptCallback={this.runScript}
                    toggleTEditorCallback = {this.toggleTEditor}
                    updateNotebookBlkStateCallback = {this.updateNotebookBlkState}
                    toggleNotebookBlkCallback = {this.toggleNotebookBlk}
                    ActiveBlkID = {this.state.ActiveBlkID}
                    restorePanelSettingCallback = {this.restorePanelSetting}
                    selectNotebookBlkCallback = {this.selectNotebookBlk}
                    setNotebookBlkUpdate2FalseCallback = {this.setNotebookBlkUpdate2False}
                    CurrentVariableList = {this.state.CurrentVariableList}
                  />  
              </HotKeys></div>
            </div>
            
         </div>          
      )
  };
}


