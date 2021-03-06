import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { NMAVariableSelection } from './NMAVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { NMAAnalysisSetting } from "./NMAAnalysisSetting";
import { Alert } from './Alert.js'
import _ from "lodash";

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 30,
    maxHeight: 30,
    '&$expanded': {
      minHeight: 30,
      maxHeight: 30,
    },
  },
  content: {
    '&$expanded': {
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);


export class NMAPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            Treatment1: [],
            Treatment2: [],
            StudyLab: [],
            EffectSize: [],
            SE: [],
        }, 
        TreatmentLvs : [], 
        Checked: {
            Available: [],
            Treatment1: [],
            Treatment2: [],
            StudyLab: [],
            EffectSize: [],
            SE: [],
        },
        hideToRight: {
            Treatment1: false,
            Treatment2: false,
            StudyLab: false,
            EffectSize: false,
            SE: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: true,
          analysisSetting: false,
        },
        AnalysisSetting: {
          ESType: "",
          ConfLv: 95,
          ForestPlot: true,
          ForestPlotRef: "",
          NetworkPlot: true,
          HeatPlot: true, 
          FunnelPlot: true,
          FixedEffect: false,
          ConfForSE: 95,
          showConfForSE: false,

        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
        sortAvailable: false,
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "NMAPanel" && !this.props.setPanelFromNotebook) {
      let VariablesObj = _.cloneDeep(this.state.Variables)
      let CheckedObj = _.cloneDeep(this.state.Checked)
      let CurrentVariableList = Object.keys(this.props.CurrentVariableList).filter((item) => (item !== ".imp" && item !== ".id"))
      let CurrentVariableListByFileOrder = [...CurrentVariableList]
      let allVarsInCurrentList = []
      for (let key in this.state.Variables) {   
          allVarsInCurrentList = allVarsInCurrentList.concat(this.state.Variables[key])
      }

      if (JSON.stringify(CurrentVariableList.sort()) !== JSON.stringify(allVarsInCurrentList.sort())) {
          for (let key in this.state.Variables) {
              VariablesObj[key] = this.intersection(VariablesObj[key], CurrentVariableList)
              CheckedObj[key] = this.intersection(CheckedObj[key],VariablesObj[key])
          }

          let addToAvailable = this.not(CurrentVariableList, allVarsInCurrentList)
          VariablesObj["Available"] = VariablesObj["Available"].concat(addToAvailable)

          if (this.state.sortAvailable) {
            VariablesObj["Available"].sort()
          }else{
            VariablesObj["Available"] = this.intersection(CurrentVariableListByFileOrder, VariablesObj["Available"])
          }

          this.setState({Variables:{...VariablesObj}})
          this.setState({Checked: {...CheckedObj}})
      }
    }else if((this.props.currentActiveAnalysisPanel === "NMAPanel" && this.props.setPanelFromNotebook)) {
      this.setState({...this.props.tentativePanelState})
      this.props.setPanelFromNotebookToFalseCallback()
    }
    // Need to check if any treatment variable is removed?
  }

  intersection = (array1, array2) => {
    return array1.filter((item) => array2.indexOf(item) !== -1)
  }

  not = (array1, array2) => {
      return array1.filter((item) => array2.indexOf(item) === -1)
  }

  setSortAvailable = () => {
    let VariablesObj = _.cloneDeep(this.state.Variables)
    if (this.state.sortAvailable) {
      /*Changing to file order */
      VariablesObj["Available"] = this.intersection(Object.keys(this.props.CurrentVariableList).filter((item) => (item !== ".imp" && item !== ".id")), VariablesObj["Available"])
    }else {
      VariablesObj["Available"].sort()
    }
    this.setState({sortAvailable: !this.state.sortAvailable, Variables: {...VariablesObj}})
  }

  resetVarList = () => {
    let VariablesObj  = _.cloneDeep(this.state.Variables)
    let CheckedObj = _.cloneDeep(this.state.Checked)

    for (let key in this.state.Variables) {
      if (key === "Available") {
        if (this.state.sortAvailable) {
          VariablesObj[key] = Object.keys(this.props.CurrentVariableList).filter((item) => (item !== ".imp" && item !== ".id")).sort()
        }else {
          VariablesObj[key] = Object.keys(this.props.CurrentVariableList).filter((item) => (item !== ".imp" && item !== ".id"))
        }
      }
      VariablesObj[key] = []
    }

    for (let key in this.state.Checked) {
      CheckedObj[key] = []
    }

    this.setState({Variables: {...VariablesObj},
      Checked: {...CheckedObj},
      TreatmentLvs: [],
    })

  }

  handleToRight = (target, maxElement) => {
    let VariablesObj = _.cloneDeep(this.state.Variables)
    let CheckedObj = _.cloneDeep(this.state.Checked)
    
    console.log(target)
    console.log(this.props.CurrentVariableList[CheckedObj["Available"][0]])

    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
      if ((target === "Treatment1" || target === "Treatment2") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] !== "Factor")) {
        this.setState({showAlert: true, 
          alertText: "Only factor variable(s) can be entered as Treatment 1 or Treatment 2.",
          alertTitle: "Alert"
        })

      }else if ((target === "EffectSize" || target === "SE") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] !== "Numeric")) {
        this.setState({showAlert: true, 
          alertText: "Only numeric variable(s) can be entered as Effect Size or Standard Error.",
          alertTitle: "Alert"
        })
      }else if ((target === "StudyLab") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] === "Numeric")) {
        this.setState({showAlert: true, 
          alertText: "Study Labels must not be a numeric variable.",
          alertTitle: "Alert"
        })
      }else {
        VariablesObj["Available"] = this.not(VariablesObj["Available"],CheckedObj["Available"])
        VariablesObj[target] = VariablesObj[target].concat(CheckedObj["Available"])
        if (target === "Treatment1" || target === "Treatment2") {    
          this.setState({TreatmentLvs: [...this.getTreatmentLv(VariablesObj)]})       
        }
        CheckedObj["Available"] = []
        this.setState({Variables: {...VariablesObj}},
            () => this.setState({Checked: {...CheckedObj}}))  
      }      
    }else{
        if (CheckedObj["Available"].length > 0) {
          this.setState({showAlert: true, 
            alertText: "Only "+ maxElement + " " + target + " variable(s) can be specified.",
            alertTitle: "Alert"
          })
        }
    }
  }

  getTreatmentLv = (VariablesObj) => {
    let Treatment1Lvs = []
    let Treatment2Lvs = []
    let tmpTreatmentLvs = []
    if (VariablesObj["Treatment1"].length !== 0) {
      if (Object.keys(this.props.CategoricalVarLevels).indexOf(VariablesObj["Treatment1"][0]) !== -1) {
        Treatment1Lvs = [...this.props.CategoricalVarLevels[VariablesObj["Treatment1"][0]]]
      }
    }
    if (VariablesObj["Treatment2"].length !== 0) {
      if (Object.keys(this.props.CategoricalVarLevels).indexOf(VariablesObj["Treatment2"][0]) !== -1) {
        Treatment2Lvs = [...this.props.CategoricalVarLevels[VariablesObj["Treatment2"][0]]]
      }
    }
    tmpTreatmentLvs = [...new Set([...Treatment1Lvs, ...Treatment2Lvs])]
    return tmpTreatmentLvs
  }

  handleToLeft = (from) => {
      let VariablesObj = _.cloneDeep(this.state.Variables)
      let CheckedObj = _.cloneDeep(this.state.Checked)
      VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
      VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])

      if (from === "Treatment1" || from === "Treatment2") {    
        this.setState({TreatmentLvs: [...this.getTreatmentLv(VariablesObj)]}, () => console.log(this.state.TreatmentLvs))       
      }

      if (this.state.sortAvailable) {
        VariablesObj["Available"].sort()
      }else{
        VariablesObj["Available"] = this.intersection(Object.keys(this.props.CurrentVariableList).filter((item) => (item !== ".imp" && item !== ".id")), VariablesObj["Available"])
      }

      CheckedObj[from] = []
      this.setState({Variables: {...VariablesObj}},
          () => this.setState({Checked: {...CheckedObj}}))
  }
  
  handleToggle = (varname, from) => {
    
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let currentIndex = CheckedObj[from].indexOf(varname);

    if (currentIndex === -1) {
        CheckedObj[from].push(varname)
    }else {
        CheckedObj[from].splice(currentIndex, 1)
    }

    for (let key in CheckedObj) {
        if (key !== from) {
            CheckedObj[key] = [];
        }
    }        
    this.setState({Checked: {...CheckedObj}})
  }

  changeArrow = (target) => {
      let hideToRightObj = {...this.state.hideToRight}
      if (target !== "Available") {
          hideToRightObj[target] = true
      }else {
          for (let key in hideToRightObj) {
              hideToRightObj[key] = false
          }
      }
      this.setState({hideToRight:{...hideToRightObj}})
  }

  reorderTreatmentLv = (direction,index) => {
    let TreatmentLvsObj = [...this.state.TreatmentLvs]
    let tmp = ""
    if (direction === "Up") {
      if (index !== 0) {
          tmp = TreatmentLvsObj[index-1]
          TreatmentLvsObj[index-1] = TreatmentLvsObj[index]
          TreatmentLvsObj[index] = tmp
          this.setState({TreatmentLvs: [...TreatmentLvsObj]})
        }
    }else {
      if (index !== this.state.TreatmentLvs.length-1) {
          tmp = TreatmentLvsObj[index+1]
          TreatmentLvsObj[index+1] = TreatmentLvsObj[index]
          TreatmentLvsObj[index] = tmp
          this.setState({TreatmentLvs: [...TreatmentLvsObj]})
      }
    }
  }

  buildCode = () => {
    let codeString = ""
    let ESforAnalysis = this.state.AnalysisSetting.ESType
    switch(this.state.AnalysisSetting.ESType) {
      case "logOR":
        ESforAnalysis = "OR"
        break;
      case "logRR":
        ESforAnalysis = "RR"
        break;
      case "logHR":
        ESforAnalysis = "HR"
        break;
      default:
        break;
    }  
    
    let EffectSize = this.state.Variables.EffectSize

    let SE = this.state.Variables.SE
    if (this.state.AnalysisSetting.ESType === "OR" || this.state.AnalysisSetting.ESType === "RR" || this.state.AnalysisSetting.ESType === "HR") {
      codeString = codeString + "currentDataset$logES <- log(currentDataset$" + this.state.Variables.EffectSize + ")\n"  
      EffectSize = "logES"
      codeString = codeString + "currentDataset$logStdErr <- (log(currentDataset$" + this.state.Variables.SE + ")" + "- currentDataset$logES)/qnorm(1-((1-"+
      this.state.AnalysisSetting.ConfForSE /100 +")/2))\n\n"
      SE = "logStdErr"
    }

    codeString = codeString + "library(netmeta)\nnma_res <- netmeta::netmeta( TE = " + EffectSize + 
    ",\n seTE = " + SE + 
    ",\ntreat1 = " + this.state.Variables.Treatment1 +
    ",\ntreat2 = " + this.state.Variables.Treatment2 +
    ",\nstudlab = " + this.state.Variables.StudyLab + 
    ",\ndata = currentDataset, \nsm = \"" + ESforAnalysis + 
    "\",\nlevel = " + this.state.AnalysisSetting.ConfLv/100 + 
    ",\nlevel.comb = " + this.state.AnalysisSetting.ConfLv/100 +
    (this.state.AnalysisSetting.FixedEffect? ", comb.fixed = TRUE, comb.random = FALSE": ", comb.fixed = FALSE, comb.random = TRUE") + ")" 
    codeString = codeString + "\n\nnma_res \n\nnetsplit(nma_res)"
    if (this.state.AnalysisSetting.ForestPlot) {
        codeString = codeString + 
        "\nforest(netsplit(nma_res, reference.group=\""+ this.state.AnalysisSetting.ForestPlotRef + "\"))"
    }
    if (this.state.AnalysisSetting.NetworkPlot) {
        codeString = codeString +
        "\nnetgraph(nma_res"+
        (this.state.AnalysisSetting.FixedEffect? ", thickness = \"se.fixed\"" : ", thickness =\"se.random\"")+")"
    }
    if (this.state.AnalysisSetting.HeatPlot) {
        codeString = codeString +
        "\nnetheat(nma_res"+ 
        (this.state.AnalysisSetting.FixedEffect? "":", random = TRUE")+")"
    }
    if (this.state.AnalysisSetting.FunnelPlot) {
      codeString = codeString + "\nfunnel(nma_res, order = c(\"" + this.state.TreatmentLvs.join("\", \"") +
      "\"), linreg = TRUE)\n"
    }
    codeString = codeString + "\n\"Chan, G. and StatsNotebook Team (2020). StatsNotebook. (Version "+ this.props.currentVersion +") [Computer Software]. Retrieved from https://www.statsnotebook.io\"\n"+
      "\"R Core Team (2020). The R Project for Statistical Computing. [Computer software]. Retrieved from https://r-project.org\"\n" + 
      "\"Rücker, G., et al. (2016). Netmeta: network meta-analysis using frequentist methods. R package. Version 0.9–0.\"\n"
      
    this.props.updateTentativeScriptCallback(codeString, this.state) 
  }

  handlePanelExpansion = (target) => (event, newExpanded) => {
    let panelsObj = {...this.state.panels}
    panelsObj[target] = !panelsObj[target]
    this.setState({panels: panelsObj})
  }

  updateAnalysisSetting = (event,target) => {
    let AnalysisSettingObj = {...this.state.AnalysisSetting}
    
    switch (target) {
      case "ESType":
      case "ConfLv":
      case "ForestPlotRef":
      case "ConfForSE":
        AnalysisSettingObj[target] = event.target.value
        break;
      case "ForestPlot":
      case "NetworkPlot":
      case "HeatPlot":
      case "FunnelPlot":
      case "FixedEffect":
        AnalysisSettingObj[target] = !AnalysisSettingObj[target]
        break;
      default:
        break;
    }
    this.setState({AnalysisSetting: {...AnalysisSettingObj}})
  }

  openAlert = () => {
    this.setState({showAlert: true})
  };

  closeAlert = () => {
    this.setState({showAlert: false})
  }

  setAlert = (title, text) => {
    this.setState({alertTitle: title, alertText: text})
  }

  render () {
    return (
      <div className="mt-2"> 
      {this.props.currentActiveAnalysisPanel === "NMAPanel" &&
        <div>
          <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
          title = {this.state.alertTitle}
          content = {this.state.alertText}></Alert>            
          <ExpansionPanel square expanded={this.state.panels.variableSelection}
          onChange = {this.handlePanelExpansion("variableSelection")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Network Meta Analysis</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <NMAVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
              Variables = {this.state.Variables}
              Checked = {this.state.Checked}
              hideToRight = {this.state.hideToRight}
              intersectionCallback = {this.intersection}
              notCallback = {this.not}
              handleToggleCallback = {this.handleToggle}
              changeArrowCallback = {this.changeArrow}
              handleToRightCallback = {this.handleToRight}
              handleToLeftCallback = {this.handleToLeft}
              addExtraBlkCallback = {this.props.addExtraBlkCallback}
              setSortAvailableCallback = {this.setSortAvailable}
              resetVarListCallback = {this.resetVarList}
              sortAvailable = {this.state.sortAvailable}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>  
          <ExpansionPanel square expanded={this.state.panels.analysisSetting}
          onChange = {this.handlePanelExpansion("analysisSetting")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Analysis Setting</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <NMAAnalysisSetting 
              Variables = {this.state.Variables}
              CategoricalVarLevels = {this.props.CategoricalVarLevels}
              TreatmentLvs = {this.state.TreatmentLvs}
              AnalysisSetting = {this.state.AnalysisSetting}
              updateAnalysisSettingCallback = {this.updateAnalysisSetting}
              reorderTreatmentLvCallback = {this.reorderTreatmentLv}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>    
        </div>
      }
      </div>
    )
  }
}