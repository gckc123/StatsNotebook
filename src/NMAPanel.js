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

        this.setState({Variables:{...VariablesObj}})
        this.setState({Checked: {...CheckedObj}})
    }
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
    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
        VariablesObj["Available"] = this.not(VariablesObj["Available"],CheckedObj["Available"])
        VariablesObj[target] = VariablesObj[target].concat(CheckedObj["Available"])
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
      CheckedObj[from] = []
      this.setState({Variables: {...VariablesObj}},
          () => this.setState({Checked: {...CheckedObj}}))
  }
  
  handleToggle = (varname, from) => {
    
    let CheckedObj = {...this.state.Checked}
    let currentIndex = CheckedObj[from].indexOf(varname);

    console.log("Toggle")
    console.log(varname)
    console.log(from)
    console.log(currentIndex)

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
            <NMAAnalysisSetting />
            
          </ExpansionPanelDetails>
        </ExpansionPanel>    
      </div>
    )
  }
}