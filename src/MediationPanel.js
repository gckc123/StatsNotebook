import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MediationVariableSelection } from './MediationVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { MediationAnalysisSetting } from "./MediationAnalysisSetting";

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


export class MediationPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            Outcome: [],
            Exposure: [],
            Mediator: [],
            Covariate: []
        }, 
        Checked: {
            Available: [],
            Outcome: [],
            Exposure: [],
            Mediator: [],
            Covariate: []
        },
        hideToRight: {
            Outcome: false,
            Exposure: false,
            Mediator: false,
            Covariate: false
        },
        tentativeScript: "",
        panels: {
          variableSelection: false,
          analysisSetting: false,
        },
        AnalysisSetting: {
          Models: {},
          TreatLv: 1,
          ControlLv: 0,
          ConfLv: 95,
          Digits: 3,
          Simulation: 1000,
          ImputeData: true,
        }
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "MediationPanel") {
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
  }

  intersection = (array1, array2) => {
    return array1.filter((item) => array2.indexOf(item) !== -1)
  }

  not = (array1, array2) => {
      return array1.filter((item) => array2.indexOf(item) === -1)
  }

  add2ModelSelection = (CheckedObjAvailable) => {
      let ModelsObj = {...this.state.AnalysisSetting.Models}
      CheckedObjAvailable.forEach((item) => {
        ModelsObj[item] = ""
      })
      this.setState(prevState => ({
        AnalysisSetting: {
          ...prevState.AnalysisSetting,
          Models: ModelsObj,
        }
      }))
  }

  removeFromModelSelection = (CheckedObjOrigin) =>  {
    let ModelsObj = {...this.state.AnalysisSetting.Models}
    CheckedObjOrigin.forEach((item) => {
      delete ModelsObj[item]
    })
    this.setState(prevState => ({
      AnalysisSetting: {
        ...prevState.AnalysisSetting,
        Models: ModelsObj,
      }
    }))
  }

  handleToRight = (target, maxElement) => {
    let VariablesObj = {...this.state.Variables}
    let CheckedObj = {...this.state.Checked}
    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
        VariablesObj["Available"] = this.not(VariablesObj["Available"],CheckedObj["Available"])
        VariablesObj[target] = VariablesObj[target].concat(CheckedObj["Available"])
        if (target === "Outcome" || target === "Mediator") {
          this.add2ModelSelection(CheckedObj["Available"])
        }
        CheckedObj["Available"] = []
        this.setState({Variables: {...VariablesObj}},
            () => this.setState({Checked: {...CheckedObj}}))  
    }else{
        if (CheckedObj["Available"].length > 0) {
            alert("Only "+ maxElement + " " + target + " variable(s) can be specified.")
        }
    }
  }

  handleToLeft = (from) => {
      let VariablesObj = {...this.state.Variables}
      let CheckedObj = {...this.state.Checked}
      VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
      VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])
      if (from === "Outcome" || from === "Mediator") {
        this.removeFromModelSelection(CheckedObj[from])
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



  buildCode = () => {
    let mediatorModels = this.state.Variables.Mediator.map((item) => {
      return this.state.AnalysisSetting.Models[item]
    }) 
    let codeString = "med_res <- intmed::mediate(y = \"" + this.state.Variables.Outcome[0] + "\",\n"+ 
    "med = c(\""+ this.state.Variables.Mediator.join("\" ,\"") +"\"),\n"+
    "treat = \""+ this.state.Variables.Exposure[0] + "\",\n"+
    "c = c(\""+ this.state.Variables.Covariate.join("\" ,\"")+"\"),\n"+
    "ymodel = \""+ this.state.AnalysisSetting.Models[this.state.Variables.Outcome[0]] +"\",\n"+
    "mmodel = c(\"" + mediatorModels.join("\" ,\"") +"\"),\n"+
    "treat_lv = " + this.state.AnalysisSetting.TreatLv + 
    ", control_lv = " + this.state.AnalysisSetting.ControlLv +
    ", conf.level = " + this.state.AnalysisSetting.ConfLv/100 + ",\n" +
    "data = currentDataset, sim = "+ this.state.AnalysisSetting.Simulation + 
    ", digits = " + this.state.AnalysisSetting.Digits + ",\n" + 
    "HTML_report = FALSE, complete_analysis = "+ (!this.state.AnalysisSetting.ImputeData).toString().toUpperCase() +")"
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
      case "ModelSelection":
        AnalysisSettingObj.Models[event.target.name] = event.target.value
        break;
      case "ConfLv":
      case "TreatLv":
      case "ControlLv":
      case "Digits":
      case "Simulation":
        AnalysisSettingObj[target] = event.target.value
        break;
      case "ImputeData":
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
            <Typography>Causal Mediation Analysis - Variables Selection</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
            <MediationVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
            <MediationAnalysisSetting Variables = {this.state.Variables} 
            AnalysisSetting = {this.state.AnalysisSetting}
            updateAnalysisSettingCallback = {this.updateAnalysisSetting}/>
            
          </ExpansionPanelDetails>
        </ExpansionPanel>    
      </div>
    )
  }
}