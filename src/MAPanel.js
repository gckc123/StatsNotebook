import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MAVariableSelection } from './MAVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { MAAnalysisSetting } from "./MAAnalysisSetting";
import Tooltip from '@material-ui/core/Tooltip';
import { AddInteraction } from './AddInteractions';

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);
  

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


export class MAPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            StudyLab: [],
            EffectSize: [],
            SE: [],
            Covariates: [],
            Interaction: [],
        }, 
        Checked: {
            Available: [],
            StudyLab: [],
            EffectSize: [],
            SE: [],
            Covariates: [],
            Interaction: [],
        },
        hideToRight: {
            StudyLab: false,
            EffectSize: false,
            SE: false,
            Covariates: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: false,
          modelSpec: false,
          analysisSetting: false,
        },
        AnalysisSetting: {
          ConfLv: 95,
          Exponentiate: false,
          FixedEffect: false,
          Leave1Out: true,
          TrimAndFill: true,
          ForestPlot: true,
          FunnelPlot: true,
          DiagnosticPlot: true,
        }
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "MAPanel") {
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

    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
      if ((target === "EffectSize" || target === "SE") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] !== "Numeric")) {
        alert("Only numeric variable can be entered as Effect Size or Standard Error")
      }else if ((target === "StudyLab") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] === "Numeric")) {
        alert("Study Labels must not be a numeric variable.")
      }else {
        VariablesObj["Available"] = this.not(VariablesObj["Available"],CheckedObj["Available"])
        VariablesObj[target] = VariablesObj[target].concat(CheckedObj["Available"])
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
    let codeString = ""
    
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
      case "ConfLv":
        AnalysisSettingObj[target] = event.target.value
        break;
      case "Exponentiate":
      case "FixedEffect":
      case "Leave1Out":
      case "TrimAndFill":
      case "ForestPlot":
      case "FunnelPlot":
      case "DiagnosticPlot":
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
            <Typography>Meta-Analysis/ Meta-Regression</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
            <MAVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
        <ExpansionPanel square expanded={this.state.panels.modelSpec}
        onChange = {this.handlePanelExpansion("modelSpec")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Model builder - Add interaction terms</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
            <AddInteraction CurrentVariableList = {this.props.CurrentVariableList}
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
            <MAAnalysisSetting 
            Variables = {this.state.Variables}
            AnalysisSetting = {this.state.AnalysisSetting}
            updateAnalysisSettingCallback = {this.updateAnalysisSetting}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>    
      </div>
    )
  }
}