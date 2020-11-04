import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IPTWVariableSelection } from './IPTWVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { IPTWAnalysisSetting } from "./IPTWAnalysisSetting";
import { Alert } from './Alert.js';
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


export class IPTWPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            Covariates: [],
        }, 
        Checked: {
            Available: [],
            Covariates: [],
        },


        TimeVarying: [
          {
            Exposure: [],
            TVCovariates: [],
          }
        ],

        TimeVaryingChecked: [
          {
            Exposure: [],
            TVCovariates: [],
          }
        ],

        hideToRight: {
            Covariates: false,
            Exposure: false,
            TVCovariates: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: true,
          modelSpec: false,
          analysisSetting: false,
        },
        AnalysisSetting: {
          imputedDataset: false,
          imputeMissing: false,
          M: 20,
        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "IPTWPanel" && !this.props.setPanelFromNotebook) {
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

          this.setState({Variables:{...VariablesObj}, 
            Checked: {...CheckedObj} 
            })      
      }
    }else if((this.props.currentActiveAnalysisPanel === "IPTWPanel" && this.props.setPanelFromNotebook)) {
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
      Checked: {...CheckedObj}
    })

  }

  notInInt = (term, intArray) => {
    let pattern = "^"+term+"\\*|\\*"+term+"\\*|\\*"+term+"$"
    return intArray.filter((item) => item.search(pattern) === -1)
  }

  handleToRight = (target, maxElement) => {
    let VariablesObj = _.cloneDeep(this.state.Variables)
    let CheckedObj = _.cloneDeep(this.state.Checked)
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
      this.setState({Variables: {...VariablesObj}},
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
      let VariablesObj = _.cloneDeep(this.state.Variables)
      let CheckedObj = _.cloneDeep(this.state.Checked)


      VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
      VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])

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


  buildCode = () => {
    let codeString = "library(mice)\n"
    let formula = []
    let method = []
    
    
    codeString = codeString + "\n\"Chan, G. and StatsNotebook Team (2020). StatsNotebook. (Version "+ this.props.currentVersion +") [Computer Software]. Retrieved from https://www.statsnotebook.io\"\n"+
      "\"R Core Team (2020). The R Project for Statistical Computing. [Computer software]. Retrieved from https://r-project.org\"\n" +
      "\"van der Wal, W. M. and R. B. Geskus (2011). ipw: an R package for inverse probability weighting. J Stat Softw 43(13): 1-23.\"\n"

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
      case "M":
        AnalysisSettingObj[target] = event.target.value
        break;
      case "imputedDataset":
      case "imputeMissing":
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

  addTime = (currentTime) => {
    let tmp = [..._.cloneDeep(this.state.TimeVarying), {
      Exposure: [],
      TVCovariates: [...this.state.TimeVarying[currentTime]["TVCovariates"]],
    }]
    let tmp2 = [..._.cloneDeep(this.state.TimeVaryingChecked), {
      Exposure: [],
      TVCovariates: [],
    }]
    this.setState({TimeVarying: [...tmp], TimeVaryingChecked: [...tmp2]}, () => console.log(this.state.TimeVarying))
  }

  handleToggleTV = (varname, from, currentTime) => {
    let TimeVaryingCheckedObj = _.cloneDeep(this.state.TimeVaryingChecked)
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let currentIndex = TimeVaryingCheckedObj[currentTime][from].indexOf(varname)

    if (currentIndex === -1) {
      TimeVaryingCheckedObj[currentTime][from].push(varname)
    }else {
      TimeVaryingCheckedObj[currentTime][from].splice(currentIndex, 1)
    }

    for (let key in CheckedObj) {
      CheckedObj[key] = []
    }

    for (let key in TimeVaryingCheckedObj[currentTime]) {
      if (key !== from) {
        TimeVaryingCheckedObj[currentTime][key] = [];
      }
    }

    this.setState({Checked: {...CheckedObj}, TimeVaryingChecked: [...TimeVaryingCheckedObj]})
  }

  handleTVToRight = (target, maxElement, currentTime) => {
    let TimeVaryingObj = _.cloneDeep(this.state.TimeVarying)
    let CheckedObj = _.cloneDeep(this.state.Checked)

    if (TimeVaryingObj[currentTime][target].length + CheckedObj["Available"].length <= maxElement) {
      let newTerm = this.not(CheckedObj["Available"], TimeVaryingObj[currentTime][target])
      TimeVaryingObj[currentTime][target] = TimeVaryingObj[currentTime][target].concat(newTerm)
      CheckedObj["Available"] = []
      this.setState({TimeVarying: [...TimeVaryingObj], Checked: {...CheckedObj}})
    }else {
      if (CheckedObj["Available"].length > 0) {
        this.setState({showAlert: true,
          alertText: "Only" + maxElement + " " + target + " variable(s) can be specified.",
          alertTitle: "Alert"
        })
      }
    }
  }

  handleTVToLeft = (target, currentTime) => {
    let TimeVaryingObj = _.cloneDeep(this.state.TimeVarying)
    let TimeVaryingCheckedObj = _.cloneDeep(this.state.TimeVaryingChecked)


    TimeVaryingObj[currentTime][target] = this.not(TimeVaryingObj[currentTime][target], TimeVaryingCheckedObj[currentTime][target])
    TimeVaryingCheckedObj[currentTime][target] = []

    this.setState({TimeVarying: [...TimeVaryingObj], TimeVaryingChecked: [...TimeVaryingCheckedObj]}, () => {console.log(this.state.TimeVarying); console.log(this.state.TimeVaryingChecked)})
  }

  delTime = (currentTime, last) => {
    let TimeVaryingObj = _.cloneDeep(this.state.TimeVarying)
    let TimeVaryingCheckedObj = _.cloneDeep(this.state.TimeVaryingChecked)

    if (last) {
      TimeVaryingObj.pop()
      TimeVaryingCheckedObj.pop()
    } else {
      TimeVaryingObj.splice(currentTime, 1)
      TimeVaryingCheckedObj.splice(currentTime, 1)
    }

    this.setState({TimeVarying: [...TimeVaryingObj], TimeVaryingChecked: [...TimeVaryingCheckedObj]}, () => {console.log(this.state.TimeVarying); console.log(this.state.TimeVaryingChecked)})
  }

  render () {
    return (
      <div className="mt-2">
        {this.props.currentActiveAnalysisPanel === "IPTWPanel" &&
        <div>
          <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
          title = {this.state.alertTitle}
          content = {this.state.alertText}></Alert>               
          <ExpansionPanel square expanded={this.state.panels.variableSelection}
          onChange = {this.handlePanelExpansion("variableSelection")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>IPTW - Variable Selection</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <IPTWVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
              openWebpageCallback = {this.props.openWebpageCallback}
              StatsNotebookURL = {this.props.StatsNotebookURL}
              sortAvailable = {this.state.sortAvailable}
              addTimeCallback = {this.addTime}
              TimeVarying = {this.state.TimeVarying}
              TimeVaryingChecked = {this.state.TimeVaryingChecked}
              handleToggleTVCallback = {this.handleToggleTV}
              handleTVToLeftCallback = {this.handleTVToLeft}
              handleTVToRightCallback = {this.handleTVToRight}
              delTimeCallback = {this.delTime}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>  
          
          <ExpansionPanel square expanded={this.state.panels.analysisSetting}
          onChange = {this.handlePanelExpansion("analysisSetting")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Analysis Setting</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <IPTWAnalysisSetting 
              Variables = {this.state.Variables}
              AnalysisSetting = {this.state.AnalysisSetting}
              updateAnalysisSettingCallback = {this.updateAnalysisSetting}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>}
      </div>
    )
  }
}