import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IndependentTTestVariableSelection } from './IndependentTTestVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { IndependentTTestAnalysisSetting } from "./IndependentTTestAnalysisSetting";
import { Alert } from './Alert.js'

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


export class IndependentTTestPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            Outcome: [],
            Weight: [],
            Covariates: [],
        }, 
        Checked: {
            Available: [],
            Outcome: [],
            Covariates: [],
            Weight: [],
        },

        hideToRight: {
            Covariates: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: true,
          modelSpec: false,
          EMM: false,
          analysisSetting: false,
        },
        AnalysisSetting: {
          IndependentTTestPanel: {
            varianceNotEqual: false,
            robust: false,
            nonParametric: false,
            diagnosticPlot: true,
            confLv: 95,
          },  
        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "IndependentTTestPanel") {
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

          this.setState({Variables:{...VariablesObj}, 
            Checked: {...CheckedObj}, 
          })      
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

  notInInt = (term, intArray) => {
    let pattern = "^"+term+"\\*|\\*"+term+"\\*|"+"\\*"+term+"$"
    return intArray.filter((item) => item.search(pattern) === -1)
  }

  handleToRight = (target, maxElement) => {
    let VariablesObj = {...this.state.Variables}
    let CheckedObj = {...this.state.Checked}
    let AnalysisSettingObj = {...this.state.AnalysisSetting}
    let toRightVars = []
    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
      
      toRightVars = CheckedObj["Available"].filter((item) =>
        this.props.CurrentVariableList[item][0] !== "Character"
      )

      if (toRightVars.length !== CheckedObj["Available"].length) {
        this.setState({showAlert: true, 
          alertText: "Character variables will not be added. These variables need to be firstly converted into factor variables.",
          alertTitle: "Alert"
        })
      }

      VariablesObj["Available"] = this.not(VariablesObj["Available"],toRightVars)
      VariablesObj[target] = VariablesObj[target].concat(toRightVars)



      CheckedObj["Available"] = []
      this.setState({Variables: {...VariablesObj}, AnalysisSetting: {...AnalysisSettingObj}},
        () => this.setState({Checked: {...CheckedObj}}))  
      
      

    }else{
        if (CheckedObj["Available"].length > 0) {
            this.setState({showAlert: true, 
              alertText: "Only "+ maxElement + " " + target + " variable(s) can be specified.",
              alertTitle: "Alert"
            })
        }
    }
  }

  handleToLeft = (from) => {
      let VariablesObj = {...this.state.Variables}
      let CheckedObj = {...this.state.Checked}

      VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
      VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])

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

    let codeString =""
    let currentPanel = this.props.currentActiveAnalysisPanel

    this.props.updateTentativeScriptCallback(codeString) 
  }

  handlePanelExpansion = (target) => (event, newExpanded) => {
    let panelsObj = {...this.state.panels}
    panelsObj[target] = !panelsObj[target]
    this.setState({panels: panelsObj})
  }

  updateAnalysisSetting = (event, targetPanel, target) => {
    let AnalysisSettingObj = {...this.state.AnalysisSetting}
    

    switch (target) {
      case "diagnosticPlot":
      case "nonParametric":
        AnalysisSettingObj[targetPanel][target] = !AnalysisSettingObj[targetPanel][target]
        break;
      case "confLv":
        AnalysisSettingObj[targetPanel][target] = event.target.value
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
    let analysisType = "ANOVA/ ANCOVA"
    let currentPanel = this.props.currentActiveAnalysisPanel
  
    return (
      <div className="mt-2">    
      {(this.props.currentActiveAnalysisPanel === "IndependentTTestPanel") &&
        <div>
          <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
          title = {this.state.alertTitle}
          content = {this.state.alertText}></Alert>     
          <ExpansionPanel square expanded={this.state.panels.variableSelection}
          onChange = {this.handlePanelExpansion("variableSelection")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>{analysisType} - Variable Selection</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <IndependentTTestVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
              <IndependentTTestAnalysisSetting 
              Variables = {this.state.Variables}
              currentActiveAnalysisPanel = {this.props.currentActiveAnalysisPanel}
              AnalysisSetting = {this.state.AnalysisSetting}
              updateAnalysisSettingCallback = {this.updateAnalysisSetting}
              imputedDataset = {this.props.imputedDataset}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      }    
      </div>
    )
  }
}