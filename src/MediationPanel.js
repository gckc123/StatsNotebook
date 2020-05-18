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
        expandedVariableSelection: true,
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
    //Build code
    this.buildCode()
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

  buildCode = () => {
    let codeString = "med_res <- intmed::mediate(y = \"" + this.state.Variables.Outcome[0] + "\",\n"+ 
    " med = c(\""+ this.state.Variables.Mediator.join("\" ,\"") +"\"),\n"+
    " treat = \""+ this.state.Variables.Exposure[0] + "\",\n"+
    "c = c(\""+ this.state.Variables.Covariate.join("\" ,\"")+"\"),\n"+
    " ymodel = \"logistic regression\",\n"+
    "mmodel = c(\"logistic regression\", \"logistic regression\"),\n"+
    "treat_lv = 1, control_lv = 0, conf.level = 0.9,\n" +
    "data = currentDataset, sim = 100, digits = 3,\n" + 
    " HTML_report = FALSE, complete_analysis = TRUE)"
    this.props.updateTentativeScriptCallback(codeString)
  }

  render () {
    return (
      <div className="mt-2">        
        <ExpansionPanel square expanded={this.state.expandedVariableSelection}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Mediation analysis</Typography>
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
      </div>
    )
  }
}