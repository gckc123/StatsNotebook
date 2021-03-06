import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "./App.css";
import "./AnalysisPanelElements.css";
import { Alert } from './Alert.js'
import { CrosstabVariableSelection } from './CrosstabVariableSelection';
import { CrosstabAnalysisSetting } from './CrosstabAnalysisSetting';
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


export class CrosstabPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            SplitBy: [],
            RowVars: [],
            ColVars: [],
            Weight: [],
        }, 

        Checked: {
            Available: [],
            SplitBy: [],
            RowVars: [],
            ColVars: [],
            Weight: [],
        },
        hideToRight: {
            SplitBy: false,
            RowVars: false,
            ColVars: false,
            Weight: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: true,
          analysisSetting: false,
        },
        AnalysisSetting: {
          OriginalData: true,
          RowPercent: true,
          ColPercent: false,
          OverallPercent: false,
          IncludeNA: false,
          ChisqTest: false,
          FisherTest: false,          
        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
        sortAvailable: false,
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "CrosstabPanel" && !this.props.setPanelFromNotebook) {
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
    }else if((this.props.currentActiveAnalysisPanel === "CrosstabPanel" && this.props.setPanelFromNotebook)) {
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
    })

  }

  handleToRight = (target, maxElement) => {
    let VariablesObj = _.cloneDeep(this.state.Variables)
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let toRightVars = []

    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
      if (target === "SplitBy") {

        toRightVars = CheckedObj["Available"].filter((item) =>
          this.props.CurrentVariableList[item][0] === "Factor"

        )

        if (toRightVars.length !== CheckedObj["Available"].length) {
          this.setState({showAlert: true, 
            alertText: "Only factor variable(s) can be entered into \"Split By\". Non-factor variables will be dropped.",
            alertTitle: "Alert"
          })
        }
        

      }else if (target === "RowVars" || target === "ColVars" || target === "Weight") {
        
        toRightVars = CheckedObj["Available"].filter((item) =>
          this.props.CurrentVariableList[item][0] !== "Character"
        )

        if (toRightVars.length !== CheckedObj["Available"].length) {
          this.setState({showAlert: true, 
            alertText: "Character variables will not be added. These variables need to be firstly converted into factor variables.",
            alertTitle: "Alert"
          })
        }
        
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
    let codeString = "library(tidyverse)\n\n"
    let dataset = ""

    console.log(this.props.imputedDataset)

    if (this.props.imputedDataset) {
      if (this.state.AnalysisSetting.OriginalData) {
        codeString = codeString + "dataSubset <- currentDataset %>%\n  filter(.imp == 0)\n\n"
      }else {
        codeString = codeString + "dataSubset <- currentDataset %>%\n  filter(.imp == 1)\n\n"
      }
      dataset = "dataSubset"
    }else{
      dataset = "currentDataset"
    }

    if (this.state.Variables.Weight.length > 0) {
      codeString = codeString + "library(survey)\nclus <- svydesign(id=~1, weights =~ "+ 
        this.state.Variables.Weight[0] + ", data = "+ dataset + ")\n\n"
    }

    this.state.Variables["RowVars"].forEach((rowItem) => {
      if (this.state.Variables.Weight.length === 0) {
        if (this.state.Variables["ColVars"].length > 0){ 
          this.state.Variables["ColVars"].forEach((colItem) => {
            codeString = codeString + "tab <- "+ dataset +" %>%\n  select(" +
            rowItem + ", " + colItem + (this.state.Variables["SplitBy"].length > 0 ? ", " + 
              this.state.Variables["SplitBy"].join(", ") : "") + ") %>%\n  " +
              "table("+ (this.state.AnalysisSetting["IncludeNA"] ? "useNA=\"always\"" : "") + ")\n\ntab\n\n"

            if (this.state.Variables["SplitBy"].length === 0) {
              if (this.state.AnalysisSetting["RowPercent"]) {
                codeString = codeString + "tab %>%\n  prop.table(1)\n\n"
              }

              if (this.state.AnalysisSetting["ColPercent"]) {
                codeString = codeString + "tab %>%\n  prop.table(2)\n\n"
              }

              if (this.state.AnalysisSetting["OverallPercent"]) {
                codeString = codeString + "tab %>%\n  prop.table()\n\n"
              }

              if (this.state.AnalysisSetting["ChisqTest"]) {
                codeString = codeString + "tab %>%\n chisq.test()\n\n"
              }
              
              if (this.state.AnalysisSetting["FisherTest"]) {
                codeString = codeString + "tab %>%\n fisher.test()\n\n"
              }
            }
          })
        }else{
          codeString = codeString + "tab <- "+ dataset + " %>%\n  select(" +
          rowItem + ") %>%\n  table(dnn = \""+ rowItem + "\""+ (this.state.AnalysisSetting["IncludeNA"] ? ", useNA=\"always\"" : "") +")\n\ntab\n\n"
          if (this.state.AnalysisSetting["RowPercent"]) {
            codeString = codeString + "tab %>%\n  prop.table()\n\n"
          }
        }
      }else {
        
        if (this.state.Variables["ColVars"].length > 0) {
          this.state.Variables["ColVars"].forEach((colItem) => {
            codeString = codeString + "tab <- svytable(~" + rowItem + "+" + colItem + ", clus" +
              (this.state.AnalysisSetting["IncludeNA"] ? ", exclude = NULL, na.action = na.pass": "") + ")" + 
              "\nsummary(tab)\n\n"

              if (this.state.AnalysisSetting["RowPercent"]) {
                codeString = codeString + "tab %>%\n  prop.table(1)\n\n"
              }

              if (this.state.AnalysisSetting["ColPercent"]) {
                codeString = codeString + "tab %>%\n  prop.table(2)\n\n"
              }

              if (this.state.AnalysisSetting["OverallPercent"]) {
                codeString = codeString + "tab %>%\n  prop.table()\n\n"
              }
          })
        }else{
          codeString = codeString + "tab <- svytable(~" + rowItem + ", clus" + 
          (this.state.AnalysisSetting["IncludeNA"] ? ", exclude = NULL, na.action = na.pass" : "") + ")" + 
          "\ntab\n\n"

          if (this.state.AnalysisSetting["RowPercent"]) {
            codeString = codeString + "tab %>%\n  prop.table()\n\n"
          }
        }
      }
    })

    codeString = codeString + "\n\"Chan, G. and StatsNotebook Team (2020). StatsNotebook. (Version "+ this.props.currentVersion +") [Computer Software]. Retrieved from https://www.statsnotebook.io\"\n"+
      "\"R Core Team (2020). The R Project for Statistical Computing. [Computer software]. Retrieved from https://r-project.org\"\n"
      
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
      case "RowPercent":
      case "ColPercent":
      case "OverallPercent":
      case "IncludeNA":
      case "ChisqTest":
      case "FisherTest":
      case "OriginalData":
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
      {this.props.currentActiveAnalysisPanel === "CrosstabPanel" &&
        <div>
        <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
        title = {this.state.alertTitle}
        content = {this.state.alertText}></Alert>            
        <ExpansionPanel square expanded={this.state.panels.variableSelection}
        onChange = {this.handlePanelExpansion("variableSelection")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Frequency - Variable selection</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
            <CrosstabVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
            <Typography>Statistics</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
            <CrosstabAnalysisSetting 
              Variables = {this.state.Variables}
              CategoricalVarLevels = {this.props.CategoricalVarLevels}
              AnalysisSetting = {this.state.AnalysisSetting}
              updateAnalysisSettingCallback = {this.updateAnalysisSetting}
              imputedDataset = {this.props.imputedDataset}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>  
    </div>}  
      </div>
    )
  }
}