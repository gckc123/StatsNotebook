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
          Treat_lv: 1,
          Control_lv: 0,
          Conf_lv: 0.95,
          Simulation: 1000,
          Complete_analysis: "true",
        }
    }
  }

  componentDidUpdate() {
    //Update variable list
    let VariablesObj = {...this.state.Variables}
    let CheckedObj = {...this.state.Checked}
    let CurrentVariableList = this.props.CurrentVariableList
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


  //This function needs to be updated when more panels are added
  //Currently this is called in ComponentDidUpdate() 
  //This is problematic when there are more than 1 panel!
  buildCode = () => {
    let codeString = "med_res <- intmed::mediate(y = \"" + this.state.Variables.Outcome[0] + "\",\n"+ 
    "med = c(\""+ this.state.Variables.Mediator.join("\" ,\"") +"\"),\n"+
    "treat = \""+ this.state.Variables.Exposure[0] + "\",\n"+
    "c = c(\""+ this.state.Variables.Covariate.join("\" ,\"")+"\"),\n"+
    "ymodel = \"logistic regression\",\n"+
    "mmodel = c(\"logistic regression\", \"logistic regression\"),\n"+
    "treat_lv = 1, control_lv = 0, conf.level = 0.9,\n" +
    "data = currentDataset, sim = 100, digits = 3,\n" + 
    "HTML_report = FALSE, complete_analysis = TRUE)"
    this.props.updateTentativeScriptCallback(codeString)
    console.log("building code!")
  }

  handlePanelExpansion = (target) => (event, newExpanded) => {
    let panelsObj = this.state.panels
    panelsObj[target] = !panelsObj[target]
    this.setState({panels: panelsObj})

  }

  render () {
    return (
      <div className="mt-2" onBlur={this.buildCode} onMouseLeave={this.buildCode}>        
        <ExpansionPanel square expanded={this.state.panels.variableSelection}
        onChange = {this.handlePanelExpansion("variableSelection")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Causal Mediation Analysis - Variables Selection</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
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
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>  
        <ExpansionPanel square expanded={this.state.panels.analysisSetting}
        onChange = {this.handlePanelExpansion("analysisSetting")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Analysis Setting</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <MediationAnalysisSetting Variables = {this.state.Variables}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>    
      </div>
    )
  }
}