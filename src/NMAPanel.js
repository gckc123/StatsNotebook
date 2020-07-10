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
          variableSelection: false,
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
          FunnelPlotOrder: []
        }
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "NMAPanel") {
      let VariablesObj = {...this.state.Variables}
      let CheckedObj = {...this.state.Checked}
      let CurrentVariableList = Object.keys(this.props.CurrentVariableList)
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

          VariablesObj["Available"].sort()

          this.setState({Variables:{...VariablesObj}})
          this.setState({Checked: {...CheckedObj}})
      }
    }
    // Need to check if any treatment variable is removed?
  }

  intersection = (array1, array2) => {
    return array1.filter((item) => array2.indexOf(item) !== -1)
  }

  not = (array1, array2) => {
      return array1.filter((item) => array2.indexOf(item) === -1)
  }


  handleToRight = (target, maxElement) => {
    let VariablesObj = {...this.state.Variables}
    let CheckedObj = {...this.state.Checked}
    
    console.log(target)
    console.log(this.props.CurrentVariableList[CheckedObj["Available"][0]])

    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
      if ((target === "Treatment1" || target === "Treatment2") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] !== "Factor")) {
        alert("Only factor variable(s) can be entered as Treatment 1 or Treatment 2.")
      }else if ((target === "EffectSize" || target === "SE") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] !== "Numeric")) {
        alert("Only numeric variable(s) can be entered as Effect Size or Standard Error")
      }else if ((target === "StudyLab") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] === "Numeric")) {
        alert("Study Labels must not be a numeric variable.")
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
            alert("Only "+ maxElement + " " + target + " variable(s) can be specified.")
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
      let VariablesObj = {...this.state.Variables}
      let CheckedObj = {...this.state.Checked}
      VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
      VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])

      if (from === "Treatment1" || from === "Treatment2") {    
        this.setState({TreatmentLvs: [...this.getTreatmentLv(VariablesObj)]}, () => console.log(this.state.TreatmentLvs))       
      }

      VariablesObj["Available"].sort()

      CheckedObj[from] = []
      this.setState({Variables: {...VariablesObj}},
          () => this.setState({Checked: {...CheckedObj}}))
  }
  
  handleToggle = (varname, from) => {
    
    let CheckedObj = {...this.state.Checked}
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
    let codeString = "library(netmeta)\nnma_res <- netmeta::netmeta( TE = " + this.state.Variables.EffectSize + 
    ",\n seTE = " + this.state.Variables.SE + 
    ",\ntreat1 = " + this.state.Variables.Treatment1 +
    ",\ntreat2 = " + this.state.Variables.Treatment2 +
    ",\nstudlab = " + this.state.Variables.StudyLab + 
    ",\ndata = currentDataset, \nsm = \"" + this.state.AnalysisSetting.ESType + 
    "\",\nlevel = " + this.state.AnalysisSetting.ConfLv/100 + 
    ",\nlevel.comb = " + this.state.AnalysisSetting.ConfLv/100 +")" 
    codeString = codeString + "\nsummary(nma_res) \nnetsplit(nma_res)"
    if (this.state.AnalysisSetting.ForestPlot) {
        codeString = codeString + 
        "\nforest(netsplit(nma_res, reference.group=\""+ this.state.AnalysisSetting.ForestPlotRef + "\"))"
    }
    if (this.state.AnalysisSetting.NetworkPlot) {
        codeString = codeString +
        "\nnetgraph(nma_res)"
    }
    if (this.state.AnalysisSetting.HeatPlot) {
        codeString = codeString +
        "\nnetheat(nma_res)"
    }
    if (this.state.AnalysisSetting.FunnelPlot) {
      codeString = codeString + "\nfunnel(nma_res, order = c(\"" + this.state.TreatmentLvs.join("\", \"") +
      "\"), linreg = TRUE)\n"
    }
    this.props.updateTentativeScriptCallback(codeString) 
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
        AnalysisSettingObj[target] = event.target.value
        break;
      case "ForestPlot":
      case "NetworkPlot":
      case "HeatPlot":
      case "FunnelPlot":
        AnalysisSettingObj[target] = !AnalysisSettingObj[target]
        break;
      default:
        break;
    }
    this.setState({AnalysisSetting: {...AnalysisSettingObj}})
  }

  render () {
    return (
      <div className="mt-2">        
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
    )
  }
}