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
        ExposureLvs: [], 

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
          variableSelection: true,
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
          ImputedDataset: false,
          M: 20,
          incint: false,
          incmmint: false,
          catExposure: false,
        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
        sortAvailable: false,
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "MediationPanel" && !this.props.setPanelFromNotebook) {
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
    }else if((this.props.currentActiveAnalysisPanel === "MediationPanel" && this.props.setPanelFromNotebook)) {
      this.setState({...this.props.tentativePanelState})
      this.props.setPanelFromNotebookToFalseCallback()
    }
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
    let VariablesObj = _.cloneDeep(this.state.Variables)
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let AnalysisSettingObj = _.cloneDeep(this.state.AnalysisSetting)
    let ExposureLvsArr = [...this.state.ExposureLvs]

    console.log(VariablesObj[target].length)
    console.log(CheckedObj["Available"])

    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
        VariablesObj["Available"] = this.not(VariablesObj["Available"],CheckedObj["Available"])
        VariablesObj[target] = VariablesObj[target].concat(CheckedObj["Available"])
        if (target === "Outcome" || target === "Mediator") {
          this.add2ModelSelection(CheckedObj["Available"])
        }
        if (target === "Exposure") {
          if (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] === "Factor") {
            AnalysisSettingObj["catExposure"] = true
            AnalysisSettingObj["TreatLv"] = ""
            AnalysisSettingObj["ControlLv"] = ""
            ExposureLvsArr = [...this.props.CategoricalVarLevels[CheckedObj["Available"][0]]]
            
          }
        }
        CheckedObj["Available"] = []
        this.setState({Variables: {...VariablesObj}, AnalysisSetting: {...AnalysisSettingObj}, ExposureLvs: [...ExposureLvsArr], Checked: {...CheckedObj}})  
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
      let AnalysisSettingObj = _.cloneDeep(this.state.AnalysisSetting)
      let ExposureLvsArr = [...this.state.ExposureLvs]

      VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
      VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])
      if (from === "Outcome" || from === "Mediator") {
        this.removeFromModelSelection(CheckedObj[from])
      }

      if (from === "Exposure") {  
        AnalysisSettingObj["catExposure"] = false
        AnalysisSettingObj["TreatLv"] = 1
        AnalysisSettingObj["ControlLv"] = 0
        ExposureLvsArr = []
      }

      if (this.state.sortAvailable) {
        VariablesObj["Available"].sort()
      }else{
        VariablesObj["Available"] = this.intersection(Object.keys(this.props.CurrentVariableList).filter((item) => (item !== ".imp" && item !== ".id")), VariablesObj["Available"])
      }


      CheckedObj[from] = []
      this.setState({Variables: {...VariablesObj}, ExposureLvs: [...ExposureLvsArr], AnalysisSetting: {...AnalysisSettingObj}},
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

    let codeString = ""
    
    let Exposure = [...this.state.Variables.Exposure]

    if (this.state.AnalysisSetting.catExposure) {
      codeString = codeString + "currentDataset$" + this.state.Variables.Exposure[0] + "_" + this.state.AnalysisSetting.TreatLv + " = NA\n" + 
      "currentDataset$"+ this.state.Variables.Exposure[0] + "_" + this.state.AnalysisSetting.TreatLv + "[currentDataset$" + this.state.Variables.Exposure[0] + 
      " == \"" + this.state.AnalysisSetting.TreatLv + "\"] <- 1\n" + 
      "currentDataset$"+ this.state.Variables.Exposure[0] + "_" + this.state.AnalysisSetting.TreatLv + "[currentDataset$" + this.state.Variables.Exposure[0] + 
      " == \"" + this.state.AnalysisSetting.ControlLv + "\"] <- 0\n\n"
      Exposure[0] = this.state.Variables.Exposure[0] + "_" + this.state.AnalysisSetting.TreatLv
      

    }

    let mediatorModels = this.state.Variables.Mediator.map((item) => {
      return this.state.AnalysisSetting.Models[item]
    }) 

    if (this.state.AnalysisSetting.ImputeData) {
      if (Object.keys(this.props.CurrentVariableList).indexOf(".imp") !== -1) {
        codeString = codeString + "currentDataset <- currentDataset[which(currentDataset$.imp == 0),]\n" +
        "currentDataset <- currentDataset[!(names(currentDataset) %in% c(\".id\", \".imp\"))]\n\n"
      }

      codeString = codeString + "\"Multiple imputation\"\n\nlibrary(mice)\n"
      let formula = []
      let method = []
      let formulaCode = "formulas <- make.formulas(currentDataset)\n"

      let analysisVars = this.state.Variables.Covariate.concat(this.state.Variables.Outcome).concat(Exposure).concat(this.state.Variables.Mediator)

      let intTerm = []

      if (this.state.AnalysisSetting.incint) {
        this.state.Variables.Mediator.forEach((med) => {
          intTerm.push(med + "*" + Exposure)
        })
      }

      if (this.state.AnalysisSetting.incmmint && this.state.Variables.Mediator.length >= 2) {
        this.state.Variables.Mediator.forEach((med, index) => {
          for(let i = index+1; i < this.state.Variables.Mediator.length; i++) {
            intTerm.push(med + "*" + this.state.Variables.Mediator[i])
          }
        })
      }

      analysisVars.forEach((variable) => {
        let predictor = analysisVars.filter((item) => item !== variable)
        formula.push("formulas$"+variable+" =" + variable + " ~ " + 
        predictor.join(" + ") + (intTerm.length > 0 ? " + " : "") + 
        intTerm.join(" + "))
      })

      let notIncludedVars = this.not(this.state.Variables.Available, analysisVars)
        notIncludedVars.forEach((variable) => {
          if (variable !== ".id" && variable !== ".imp") {
            method.push("meth[\""+variable+"\"] <- \"\"")
          }
      })

      formulaCode = formulaCode + "\n" + formula.join("\n") + "\n"
      let methodCode = "meth <- make.method(currentDataset)\n" + method.join("\n") + "\n"
      codeString = codeString + "\n" + formulaCode + "\n" + methodCode + "\nimputedDataset <- parlmice(currentDataset,\n  method = meth,\n  formulas = formulas,\n  m = "+ 
        this.state.AnalysisSetting.M + ",\n  n.core = " + this.props.CPU + ", \n  n.imp.core = "+ Math.ceil(this.state.AnalysisSetting.M/this.props.CPU) +
        ")\n\nplot(imputedDataset)\ncurrentDataset <- complete(imputedDataset, action = \"long\", include = TRUE)\n\n"
    }

    

    codeString = codeString + "\"Causal Mediation Analysis\"\n\nmed_res <- intmed::mediate(y = \"" + this.state.Variables.Outcome[0] + "\",\n"+ 
    "  med = c(\""+ this.state.Variables.Mediator.join("\" ,\"") +"\"),\n"+
    "  treat = \""+ Exposure[0] + "\",\n"+
    (this.state.Variables.Covariate.length > 0 ? "  c = c(\""+ this.state.Variables.Covariate.join("\" ,\"")+"\"),\n" : "")+
    "  ymodel = \""+ this.state.AnalysisSetting.Models[this.state.Variables.Outcome[0]] +"\",\n"+
    "  mmodel = c(\"" + mediatorModels.join("\" ,\"") +"\"),\n"+
    "  treat_lv = " + this.state.AnalysisSetting.TreatLv + 
    ", control_lv = " + this.state.AnalysisSetting.ControlLv + 
    ", incint = " + (this.state.AnalysisSetting.incint? "TRUE": "FALSE") + 
    ", inc_mmint = " + (this.state.AnalysisSetting.incmmint ? "TRUE" : "FALSE") +
    ",\n  conf.level = " + this.state.AnalysisSetting.ConfLv/100 + ",\n" +
    "  data = currentDataset, sim = "+ this.state.AnalysisSetting.Simulation + 
    ", digits = " + this.state.AnalysisSetting.Digits + ",\n" + 
    "  HTML_report = FALSE, complete_analysis = "+ (!this.state.AnalysisSetting.ImputeData).toString().toUpperCase() + ",\n  imputed_data = " +
    (this.state.AnalysisSetting.ImputeData || this.state.AnalysisSetting.ImputedDataset? "TRUE":"FALSE") + ")"
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
      case "ModelSelection":
        AnalysisSettingObj.Models[event.target.name] = event.target.value
        break;
      case "ConfLv":
      case "TreatLv":
      case "ControlLv":
      case "Digits":
      case "Simulation":
      case "M":
        AnalysisSettingObj[target] = event.target.value
        break;
      case "ImputeData":
        AnalysisSettingObj[target] = !AnalysisSettingObj[target]
        AnalysisSettingObj["ImputedDataset"] = false
        break;
      case "ImputedDataset":
        AnalysisSettingObj[target] = !AnalysisSettingObj[target]
        AnalysisSettingObj["ImputeData"] = false
        break;
      case "incint":
      case "incmmint":
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
      {this.props.currentActiveAnalysisPanel === "MediationPanel" &&
        <div>
          <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
          title = {this.state.alertTitle}
          content = {this.state.alertText}></Alert>      
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
              setSortAvailableCallback = {this.setSortAvailable}
              resetVarListCallback = {this.resetVarList}
              sortAvailable = {this.state.sortAvailable}
              openWebpageCallback = {this.props.openWebpageCallback}
              StatsNotebookURL = {this.props.StatsNotebookURL}
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
              updateAnalysisSettingCallback = {this.updateAnalysisSetting}
              CurrentVariableList = {this.props.CurrentVariableList}
              ExposureLvs = {this.state.ExposureLvs}/>
              
            </ExpansionPanelDetails>
          </ExpansionPanel>  
        </div>}  
      </div>
    )
  }
}