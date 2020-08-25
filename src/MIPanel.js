import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MIVariableSelection } from './MIVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { MIAnalysisSetting } from "./MIAnalysisSetting";
import { AddInteraction } from './AddInteractions';
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


export class MIPanel extends Component {

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
            CovariatesIntSelection: [],
        },
        interaction: [],
        checkedInteraction: [],
        hideToRight: {
            Covariates: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: true,
          modelSpec: false,
          analysisSetting: false,
        },
        AnalysisSetting: {
          M: 20,
        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "MIPanel" && !this.props.setPanelFromNotebook) {
      let VariablesObj = _.cloneDeep(this.state.Variables)
      let CheckedObj = _.cloneDeep(this.state.Checked)
      let CurrentVariableList = Object.keys(this.props.CurrentVariableList).filter((item) => (item !== ".imp" && item !== ".id"))
      let allVarsInCurrentList = []
      for (let key in this.state.Variables) {   
          allVarsInCurrentList = allVarsInCurrentList.concat(this.state.Variables[key])
      }

      if (JSON.stringify(CurrentVariableList.sort()) !== JSON.stringify(allVarsInCurrentList.sort())) {
          for (let key in this.state.Variables) {
              VariablesObj[key] = this.intersection(VariablesObj[key], CurrentVariableList)
              CheckedObj[key] = this.intersection(CheckedObj[key],VariablesObj[key])
          }

          let interactionObj = this.state.interaction.filter((item) => {
            let terms = item.split("*")
            let match = this.intersection(terms, VariablesObj["Covariates"])
            if (match.length === terms.length)
              return true
            else
              return false
          })

          CheckedObj["CovariatesIntSelection"] = this.intersection(CheckedObj["CovariatesIntSelection"], VariablesObj["Covariates"])

          let checkedInteractionObj = this.intersection(this.state.checkedInteraction, interactionObj)
          let addToAvailable = this.not(CurrentVariableList, allVarsInCurrentList)
          VariablesObj["Available"] = VariablesObj["Available"].concat(addToAvailable)

          VariablesObj["Available"].sort()

          this.setState({Variables:{...VariablesObj}, 
            Checked: {...CheckedObj}, 
            interaction: [...interactionObj],
            checkedInteraction: [...checkedInteractionObj]})      
      }
    }else if((this.props.currentActiveAnalysisPanel === "MIPanel" && this.props.setPanelFromNotebook)) {
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

  notInInt = (term, intArray) => {
    let pattern = "^"+term+"\\*|\\*"+term+"\\*|"+"\\*"+term+"$"
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
      let interactionArr = [...this.state.interaction]
      let checkedInteractionArr = [...this.state.checkedInteraction]

      VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
      VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])

      VariablesObj["Available"].sort()

      if (from === "Covariates") {
        interactionArr = this.state.interaction.filter((item) => {
          let terms = item.split("*")
          let match = this.intersection(terms, VariablesObj["Covariates"])
          if (match.length === terms.length)
            return true
          else
            return false
        })
        checkedInteractionArr = this.intersection(checkedInteractionArr, interactionArr)
      }

      CheckedObj[from] = []
      this.setState({Variables: {...VariablesObj}},
          () => this.setState({Checked: {...CheckedObj}, interaction: [...interactionArr],
        checkedInteraction: [...checkedInteractionArr]}))
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
    this.setState({Checked: {...CheckedObj}, checkedInteraction: []})
  }

  handleToggleInteraction = (varname, from) => {
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let CheckedIntObj = [...this.state.checkedInteraction]
    let currentIndex = CheckedIntObj.indexOf(varname)
    
    if (currentIndex === -1) {
      CheckedIntObj.push(varname)
    }else {
      CheckedIntObj.splice(currentIndex, 1)
    }

    for (let key in CheckedObj) {
      CheckedObj[key] = []
    }

    this.setState({checkedInteraction: CheckedIntObj, Checked: {...CheckedObj}})
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

  addInteractionTerm = () => {
    let interactionObj = [...this.state.interaction]
    let CheckedObj = _.cloneDeep(this.state.Checked)
    if (CheckedObj["CovariatesIntSelection"].length <= 1) {
      this.setState({showAlert: true, 
        alertText: "Please select at least two variables.",
        alertTitle: "Alert"
      })
    }else {
      interactionObj.push(CheckedObj["CovariatesIntSelection"].join("*"))
      CheckedObj["CovariatesIntSelection"] = []
      this.setState({interaction: interactionObj, Checked: {...CheckedObj}})
    }
  }

  delInteractionTerm = () => {
    let interactionObj = this.not(this.state.interaction, this.state.checkedInteraction)
    this.setState({interaction: interactionObj, checkedInteraction: []})
  }

  buildCode = () => {
    let codeString = "library(mice)\n"
    let formula = []
    let method = []
    
    let formulaCode = "formulas <- make.formulas(currentDataset)\n"

    this.state.Variables.Covariates.forEach((variable) => {
      let intTerm = this.notInInt(variable, this.state.interaction)
      let predictor = this.state.Variables.Covariates.filter((item) => item !== variable)      
      formula.push("formulas$"+variable+" =" + variable + " ~ " + 
        predictor.join(" + ") + (intTerm.length > 0 ? " + " : "") + 
        intTerm.join(" + "))
    })

    let notIncludedVars = this.not(this.state.Variables.Available, this.state.Variables.Covariates)
    notIncludedVars.forEach((variable) => {
      method.push("meth[\""+variable+"\"] <- \"\"")
    })

    formulaCode = formulaCode + "\n" + formula.join("\n") + "\n"
    let methodCode = "meth <- make.method(currentDataset)\n" + method.join("\n") + "\n"
    codeString = codeString + "\n" + formulaCode + "\n" + methodCode + "\nimputedDataset <- parlmice(currentDataset,\n  method = meth,\n  formulas = formulas,\n  m = "+ 
    this.state.AnalysisSetting.M + ",\n  n.core = " + this.props.CPU + ", \n  n.imp.core = "+ Math.ceil(this.state.AnalysisSetting.M/this.props.CPU) +
    ")\n\nplot(imputedDataset)\ncurrentDataset <- complete(imputedDataset, action = \"long\", include = TRUE) "

    

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
        {this.props.currentActiveAnalysisPanel === "MIPanel" &&
        <div>
          <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
          title = {this.state.alertTitle}
          content = {this.state.alertText}></Alert>               
          <ExpansionPanel square expanded={this.state.panels.variableSelection}
          onChange = {this.handlePanelExpansion("variableSelection")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Multiple Imputation - Variable Selection</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <MIVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
              <Typography>Passive Imputation - Add interaction terms</Typography>
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
              interaction = {this.state.interaction}
              checkedInteraction = {this.state.checkedInteraction}
              addInteractionTermCallback = {this.addInteractionTerm}
              handleToggleInteractionCallback = {this.handleToggleInteraction}
              delInteractionTermCallback = {this.delInteractionTerm}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>    
          <ExpansionPanel square expanded={this.state.panels.analysisSetting}
          onChange = {this.handlePanelExpansion("analysisSetting")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Analysis Setting</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <MIAnalysisSetting 
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