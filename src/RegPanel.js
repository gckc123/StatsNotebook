import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { RegVariableSelection } from './RegVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { RegAnalysisSetting } from "./RegAnalysisSetting";
import { AddInteraction } from './AddInteractions';
import { RandomEffectPanel } from './RandomEffectPanel';
import { EMMPanel } from './EMMPanel';
import { Alert } from './Alert.js'
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


export class RegPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            Outcome: [],
            RandomEffect: [],
            Weight: [],
            Covariates: [],
        }, 
        Checked: {
            Available: [],
            Outcome: [],
            Covariates: [],
            RandomEffect: [],
            Weight: [],
            CovariatesIntSelection: [],
            CovariatesRESelection: [],
            CovariatesEMMSelection: [],
        },
        RandomSlopes: {},
        CheckedRandomSlopes: {},
        interaction: [],
        checkedInteraction: [],

        hideToRight: {
            Outcome: false,
            Covariates: false,
            RandomEffect: false,
            Weight: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: true,
          modelSpec: false,
          randomEffect: false,
          EMM: false,
          analysisSetting: false,
        },
        AnalysisSetting: {
          M : 20,
          EMMResponseScale: false,
          Pairwise: false,
          SimpleSlope: false,
          InteractionPlot: false,
          LRPanel: {
            robustReg: false,
            imputedDataset: false,
            imputeMissing: false,
            diagnosticPlot: true,
            confLv: 95,
          },
          LogitPanel: {
            robustReg: false,
            imputedDataset: false,
            imputeMissing: false,
            diagnosticPlot: true,
            expCoeff: true,
            confLv: 95,
          },
          PoiPanel: {
            robustReg: false,
            imputedDataset: false,
            imputeMissing: false,
            diagnosticPlot: true,
            expCoeff: true,
            confLv: 95,
          },
          NbPanel: {
            robustReg: false,
            imputedDataset: false,
            imputeMissing: false,
            expCoeff: true,
            confLv: 95,
          },
          MultinomPanel: {
            robustReg: false,
            imputedDataset: false,
            imputeMissing: false,
            expCoeff: true,
            confLv: 95,

          },
          
        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
        sortAvailable: false,
    }
  }

  componentDidUpdate() {
    //Update variable list
    if ((this.props.currentActiveAnalysisPanel === "LRPanel" ||
    this.props.currentActiveAnalysisPanel === "LogitPanel" ||
    this.props.currentActiveAnalysisPanel === "PoiPanel" ||
    this.props.currentActiveAnalysisPanel === "NbPanel" ||
    this.props.currentActiveAnalysisPanel === "MultinomPanel") && !this.props.setPanelFromNotebook){
      let VariablesObj = _.cloneDeep(this.state.Variables)
      let CheckedObj = _.cloneDeep(this.state.Checked)
      let CurrentVariableList = Object.keys(this.props.CurrentVariableList).filter((item) => (item !== ".imp" && item !== ".id"))
      let CurrentVariableListByFileOrder = [...CurrentVariableList]
      let RandomSlopesObj = _.cloneDeep(this.state.RandomSlopes)
      let CheckedRandomSlopesObj = _.cloneDeep(this.state.CheckedRandomSlopes)
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

          CheckedObj["CovariatesRESelection"] = this.intersection(CheckedObj["CovariatesRESelection"], VariablesObj["Covariates"])
          CheckedObj["CovariatesIntSelection"] = this.intersection(CheckedObj["CovariatesIntSelection"], VariablesObj["Covariates"])
          CheckedObj["CovariatesEMMSelection"] = this.intersection(CheckedObj["CovariatesEMMSelection"], VariablesObj["Covariates"].concat(interactionObj))

          Object.keys(this.state.RandomSlopes).forEach((item) => {
              RandomSlopesObj[item] = this.intersection(RandomSlopesObj[item], CurrentVariableList)
              CheckedRandomSlopesObj[item] = this.intersection(CheckedRandomSlopesObj[item], RandomSlopesObj[item])
            }
          )

          let checkedInteractionObj = this.intersection(this.state.checkedInteraction, interactionObj)
          let addToAvailable = this.not(CurrentVariableList, allVarsInCurrentList)
          VariablesObj["Available"] = VariablesObj["Available"].concat(addToAvailable)

          if (this.state.sortAvailable) {
            VariablesObj["Available"].sort()
          }else{
            VariablesObj["Available"] = this.intersection(CurrentVariableListByFileOrder, VariablesObj["Available"])
          }

          this.setState({Variables:{...VariablesObj}, 
            Checked: {...CheckedObj}, 
            interaction: [...interactionObj],
            checkedInteraction: [...checkedInteractionObj],
            RandomSlopes: {...RandomSlopesObj},
            CheckedRandomSlopes: {...CheckedRandomSlopesObj}
          })      
      }
    }else if ((this.props.currentActiveAnalysisPanel === "LRPanel" ||
      this.props.currentActiveAnalysisPanel === "LogitPanel" ||
      this.props.currentActiveAnalysisPanel === "PoiPanel" ||
      this.props.currentActiveAnalysisPanel === "NbPanel" ||
      this.props.currentActiveAnalysisPanel === "MultinomPanel") && this.props.setPanelFromNotebook) {
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

  notInInt = (term, intArray) => {
    let pattern = "^"+term+"\\*|\\*"+term+"\\*|\\*"+term+"$"
    return intArray.filter((item) => item.search(pattern) === -1)
  }

  handleToRight = (target, maxElement) => {
    let VariablesObj = _.cloneDeep(this.state.Variables)
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let RandomSlopesObj = _.cloneDeep(this.state.RandomSlopes)
    let CheckedRandomSlopesObj = _.cloneDeep(this.state.CheckedRandomSlopes)
    let AnalysisSettingObj = _.cloneDeep(this.state.AnalysisSetting)
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

      if (target === "RandomEffect") {
        toRightVars.forEach((item) => {
          RandomSlopesObj[item] = []
          CheckedRandomSlopesObj[item] = []
        })
        if (this.props.currentActiveAnalysisPanel === "LRPanel" && (this.state.AnalysisSetting["LRPanel"].imputeMissing || this.state.AnalysisSetting["LRPanel"].imputedDataset)) {
          AnalysisSettingObj[this.props.currentActiveAnalysisPanel]["robustReg"] = false
        }
      }

      CheckedObj["Available"] = []
      this.setState({Variables: {...VariablesObj}, RandomSlopes: {...RandomSlopesObj}, 
        CheckedRandomSlopes: {...CheckedRandomSlopesObj}, AnalysisSetting: {...AnalysisSettingObj}},
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
      let RandomSlopesObj = _.cloneDeep(this.state.RandomSlopes)
      let CheckedRandomSlopesObj = _.cloneDeep(this.state.CheckedRandomSlopes)
      let interactionArr = [...this.state.interaction]
      let checkedInteractionArr = [...this.state.checkedInteraction]
      VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
      VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])

      if (this.state.sortAvailable) {
        VariablesObj["Available"].sort()
      }else{
        VariablesObj["Available"] = this.intersection(Object.keys(this.props.CurrentVariableList).filter((item) => (item !== ".imp" && item !== ".id")), VariablesObj["Available"])
      }

      if (from === "RandomEffect") {
        CheckedObj[from].forEach( (item) => {
          delete RandomSlopesObj[item]
          delete CheckedRandomSlopesObj[item]
        })        
      }

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
        CheckedObj["CovariatesEMMSelection"] = this.intersection(CheckedObj["CovariatesEMMSelection"], VariablesObj["Covariates"].concat(interactionArr))
      }

      CheckedObj[from] = []
      this.setState({Variables: {...VariablesObj}, RandomSlopes: {...RandomSlopesObj}, 
        CheckedRandomSlopes: {...CheckedRandomSlopesObj}, interaction: [...interactionArr],
        checkedInteraction: [...checkedInteractionArr]},
          () => this.setState({Checked: {...CheckedObj}}, ()=> console.log(this.state.RandomSlopes)))
  }
  
  handleToggle = (varname, from) => {
    
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let currentIndex = CheckedObj[from].indexOf(varname);
    let CheckedRandomSlopesObj = _.cloneDeep(this.state.CheckedRandomSlopes)
    if (currentIndex === -1) {
        CheckedObj[from].push(varname)
    }else {
        CheckedObj[from].splice(currentIndex, 1)
    }

    for (let key in CheckedObj) {
        if (key !== from && key !== "CovariatesEMMSelection") {
            CheckedObj[key] = [];
        }
    }
    
    for (let key in CheckedRandomSlopesObj) {
      CheckedRandomSlopesObj[key] = [];
    }

    this.setState({Checked: {...CheckedObj}, checkedInteraction: [], CheckedRandomSlopes: {...CheckedRandomSlopesObj}})
  }

  handleToggleInteraction = (varname, from) => {
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let CheckedIntObj = [...this.state.checkedInteraction]
    let currentIndex = CheckedIntObj.indexOf(varname)
    let CheckedRandomSlopesObj = _.cloneDeep(this.state.CheckedRandomSlopes)
    
    if (currentIndex === -1) {
      CheckedIntObj.push(varname)
    }else {
      CheckedIntObj.splice(currentIndex, 1)
    }

    for (let key in CheckedObj) {
      if (key !== "CovariatesEMMSelection") {
        CheckedObj[key] = []
      }
    }

    for (let key in CheckedRandomSlopesObj) {
      CheckedRandomSlopesObj[key] = [];
    }

    this.setState({checkedInteraction: CheckedIntObj, Checked: {...CheckedObj}, CheckedRandomSlopes: {...CheckedRandomSlopesObj}})
  }



  handleToggleRE = (varname, from) => {
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let CheckedRandomSlopesObj = _.cloneDeep(this.state.CheckedRandomSlopes)
    let currentIndex = CheckedRandomSlopesObj[from].indexOf(varname)

    if (currentIndex === -1) {
      CheckedRandomSlopesObj[from].push(varname)
    }else {
      CheckedRandomSlopesObj[from].splice(currentIndex, 1)
    }

    for (let key in CheckedObj) {
      if (key !== "CovariatesEMMSelection") {
        CheckedObj[key] = []
      }
    }

    this.setState({CheckedRandomSlopes: CheckedRandomSlopesObj, Checked: {...CheckedObj}, checkedInteraction: []}, 
      () => console.log(this.state.CheckedRandomSlopes))
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

  addRandomSlopes = (target) => {
    let RandomSlopesObj = _.cloneDeep(this.state.RandomSlopes)
    let CheckedObj = _.cloneDeep(this.state.Checked)

    

    let newTerm = this.not(CheckedObj["CovariatesRESelection"], RandomSlopesObj[target])

    RandomSlopesObj[target] = RandomSlopesObj[target].concat(newTerm)

    console.log(RandomSlopesObj)

    CheckedObj["CovariatesRESelection"] = []
    this.setState({RandomSlopes: RandomSlopesObj, Checked: CheckedObj}, () => console.log(this.state.RandomSlopes))
  }

  delRandomSlopes = (from) => {
    console.log("Deleting...")
    let RandomSlopesObj = _.cloneDeep(this.state.RandomSlopes)
    let CheckedRandomSlopesObj = _.cloneDeep(this.state.CheckedRandomSlopes)
    RandomSlopesObj[from] = this.not(RandomSlopesObj[from], CheckedRandomSlopesObj[from])
    CheckedRandomSlopesObj[from] = []
    this.setState({RandomSlopes: RandomSlopesObj, CheckedRandomSlopes: CheckedRandomSlopesObj})
    
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

      let newTerm = [...CheckedObj["CovariatesIntSelection"]]
      let addTerm = true
      let existingTerm = []
      interactionObj.forEach((item) => {
        existingTerm = item.split("*")
        if (this.intersection(newTerm, existingTerm).length === newTerm.length)
          addTerm = false
      })

      if (addTerm) {
        interactionObj.push(CheckedObj["CovariatesIntSelection"].join("*"))
        
      }

      CheckedObj["CovariatesIntSelection"] = []
      this.setState({interaction: interactionObj, Checked: {...CheckedObj}})
    }
  }

  delInteractionTerm = () => {
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let interactionObj = this.not(this.state.interaction, this.state.checkedInteraction)
    CheckedObj["CovariatesEMMSelection"] = this.intersection(CheckedObj["CovariatesEMMSelection"], this.state.Variables["Covariates"].concat(interactionObj))
    this.setState({interaction: interactionObj, checkedInteraction: [], Checked: CheckedObj})
  }


  buildCode = () => {

    let codeString =""
    let currentPanel = this.props.currentActiveAnalysisPanel

    if (this.state.AnalysisSetting[currentPanel].imputeMissing) {

      if (Object.keys(this.props.CurrentVariableList).indexOf(".imp") !== -1) {
        codeString = codeString + "currentDataset <- currentDataset[which(currentDataset$.imp == 0),]\n" +
        "currentDataset <- currentDataset[!(names(currentDataset) %in% c(\".id\", \".imp\"))]\n\n"
      }   

      codeString = codeString + "library(mice)\n"
      let formula = []
      let method = []
      let formulaCode = "formulas <- make.formulas(currentDataset)\n"

      let analysisVars = this.state.Variables.Covariates.concat(this.state.Variables.Outcome)

      analysisVars.forEach((variable) => {
        let intTerm = this.notInInt(variable, this.state.interaction)
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

    

    let formulaFixedPart = this.state.Variables.Outcome[0] +
    " ~ " + this.state.Variables.Covariates.join(" + ") + ( this.state.interaction.length > 0 ? " + " + this.state.interaction.join(" + "): "" )
    
    let formulaRandompart = ""
    if (this.state.Variables.RandomEffect.length > 0) {
      this.state.Variables.RandomEffect.forEach((item) => {
        formulaRandompart = formulaRandompart + " + (1" + (this.state.RandomSlopes[item].length > 0 ? " + " + this.state.RandomSlopes[item].join(" + "): "") +
        " | " + item + ")"
      })
    }

    switch(currentPanel) {
      case "LRPanel":
        if (this.state.AnalysisSetting[currentPanel].robustReg) {
          if (this.state.Variables.RandomEffect.length > 0) {
            codeString = codeString + "library(robustlmm) \n"
            codeString = codeString + "res <- rlmer(" + formulaFixedPart + 
            formulaRandompart +
            ",\n  data = currentDataset)\nsummary(res)\n\n"
          }else {
            codeString = codeString + "library(robustbase) \n"
            if (this.state.AnalysisSetting[currentPanel].imputeMissing || this.state.AnalysisSetting[currentPanel].imputedDataset) {
              codeString = codeString + 
              "\nres <- with(" + (this.state.AnalysisSetting[currentPanel].imputeMissing ? "imputedDataset":"as.mids(currentDataset)") + ",\n  lmrob(" + formulaFixedPart + 
              (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") + "\n))\npool(res)\nsummary(pool(res), conf.int = TRUE, conf.level = " +
              this.state.AnalysisSetting[currentPanel].confLv/100 +")\n\n"
            }else {
              codeString = codeString + "res <- lmrob(" + this.state.Variables.Outcome[0] + " ~ " + this.state.Variables.Covariates.join(" + ") +
                ( this.state.interaction.length > 0 ? " + " + this.state.interaction.join(" + "): "" ) + 
                (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") + ",\n  data=currentDataset)\nsummary(res)"+
                "\nconfint(res, level = "+ this.state.AnalysisSetting[currentPanel].confLv/100 +")\n\n"
            }
          }
        }else {

          if (this.state.Variables.RandomEffect.length > 0) {
            
            if (this.state.AnalysisSetting[currentPanel].imputeMissing || this.state.AnalysisSetting[currentPanel].imputedDataset) {
              codeString = codeString + "\nlibrary(lme4)\nlibrary(broom.mixed)\n\n"
              codeString = codeString +
              "res <- with(" + (this.state.AnalysisSetting[currentPanel].imputeMissing ? "imputedDataset":"as.mids(currentDataset)") + ",\n  lmer(" + formulaFixedPart + 
              formulaRandompart + (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
              "))\npool(res)\nsummary(pool(res), conf.int = TRUE, conf.level = " + 
              this.state.AnalysisSetting[currentPanel].confLv/100 + ")\n\n"

              if (this.state.AnalysisSetting[currentPanel].diagnosticPlot) {
                codeString = codeString + "res1 <- res$analyses[[1]]\n" +
                "library(car)\n\nres.std <- resid(res1)/sd(resid(res1))\nplot(res.std, ylab=\"Standardized Residuals\")" +
                "\noutlierTest(res1)\ninfIndexPlot(res1)\nggplot(as.data.frame(res.std), aes(sample = res.std)) +\n" + 
                "  geom_qq() +\n  geom_qq_line()\nvif(res1)\n\n"
              }

            }else{
              /* lmerTest does not work with multiple imputation - possible problem the pool function in mice */
              codeString = codeString + "\nlibrary(lme4)\nlibrary(lmerTest)\n\n"
              codeString = codeString + "res <- lmer(" + formulaFixedPart + 
                formulaRandompart + (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
                ",\n  data = currentDataset)\nsummary(res)\nconfint(res, level = "+
                this.state.AnalysisSetting[currentPanel].confLv/100 + ", method = \"Wald\")\n\n"
              if (this.state.AnalysisSetting[currentPanel].diagnosticPlot) {
                codeString = codeString + "library(car)\n\nres.std <- resid(res)/sd(resid(res))\nplot(res.std, ylab=\"Standardized Residuals\")" +
                "\noutlierTest(res)\ninfIndexPlot(res)\nggplot(as.data.frame(res.std), aes(sample = res.std)) +\n" + 
                "  geom_qq() +\n  geom_qq_line()\nvif(res)\n\n"
              }
            }

          }else {
            if (this.state.AnalysisSetting[currentPanel].imputeMissing || this.state.AnalysisSetting[currentPanel].imputedDataset) {
              codeString = codeString + 
              "res <- with(" + (this.state.AnalysisSetting[currentPanel].imputeMissing ? "imputedDataset":"as.mids(currentDataset)") + ",\n  lm(" + formulaFixedPart + 
              (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
              "))\npool(res)\nsummary(pool(res), conf.int = TRUE, conf.level = " + 
              this.state.AnalysisSetting[currentPanel].confLv/100 + ")\n\n"

              if (this.state.AnalysisSetting[currentPanel].diagnosticPlot) {
                codeString = codeString + "res1 <- res$analyses[[1]]\n" +
                "library(car)\n\nres.std <- rstandard(res1)\nplot(res.std, ylab=\"Standardized Residuals\")" +
                "\noutlierTest(res1)\ninfIndexPlot(res1)\nresidualPlots(res1)\nggplot(as.data.frame(res.std), aes(sample = res.std)) +\n" + 
                "  geom_qq() +\n  geom_qq_line()\nvif(res1)\n\n"
              }

            }else {
              codeString = codeString + "res <- lm(" + formulaFixedPart + 
              (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
              ",\n  data=currentDataset)\nsummary(res)\nconfint(res, level = " +
              this.state.AnalysisSetting[currentPanel].confLv/100 + ")\n\n"

              if (this.state.AnalysisSetting[currentPanel].diagnosticPlot) {
                codeString = codeString + "library(car)\n\nres.std <- rstandard(res)\nplot(res.std, ylab=\"Standardized Residuals\")" +
                "\noutlierTest(res)\ninfIndexPlot(res)\nresidualPlots(res)\nggplot(as.data.frame(res.std), aes(sample = res.std)) +\n" + 
                "  geom_qq() +\n  geom_qq_line()\nvif(res)\n\n"
              }
            }
          }
        }
      break;   
      case "LogitPanel":
      case "PoiPanel":
        
        let family = ""
        if (currentPanel === "LogitPanel")
          family = "family = binomial"
        else if (currentPanel === "PoiPanel")
          family = "family = poisson(link = \"log\")"

        if (this.state.AnalysisSetting[currentPanel].robustReg) {

        }else{
          if (this.state.Variables.RandomEffect.length > 0) {
            

            if (this.state.AnalysisSetting[currentPanel].imputeMissing || this.state.AnalysisSetting[currentPanel].imputedDataset) {
              codeString = codeString + "\nlibrary(lme4)\nlibrary(broom.mixed)\n\n"
              codeString = codeString +
                "res <- with(" + (this.state.AnalysisSetting[currentPanel].imputeMissing ? "imputedDataset":"as.mids(currentDataset)") + ",\n  glmer(" + formulaFixedPart + 
                formulaRandompart + ",\n  " + family +
                (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
                "))\npool(res)\nsummary(pool(res), conf.int = TRUE, conf.level = " + 
                this.state.AnalysisSetting[currentPanel].confLv/100 + ",\n  exponentiate = " +
                this.state.AnalysisSetting[currentPanel].expCoeff.toString().toUpperCase() + ")\n\n"
            }else
            {
              /* lmerTest does not work with multiple imputation - possible problem the pool function in mice */
              codeString = codeString + "\nlibrary(lme4)\n\n"
              codeString = codeString + "res <- glmer(" + formulaFixedPart + 
                formulaRandompart + ",\n  " + family + 
                (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
                ",\n  data = currentDataset)\nsummary(res)\nconfint(res, level = "+
                this.state.AnalysisSetting[currentPanel].confLv/100 + ", method = \"Wald\")\n\n"

                if (this.state.AnalysisSetting[currentPanel].expCoeff)
                  codeString = codeString +
                  "se <- sqrt(diag(vcov(res)))\n" +
                  "z <- -qnorm((1-" + this.state.AnalysisSetting[currentPanel].confLv/100 + ")/2)\n" +
                  "exp(cbind(Est=fixef(res),\n  \"" + ((100-(this.state.AnalysisSetting[currentPanel].confLv))/2).toString() + "%\"  = fixef(res) - z*se,\n  \"" + 
                  (100-(100-(this.state.AnalysisSetting[currentPanel].confLv))/2).toString() + "%\" = fixef(res) + z*se))\n\n"
            }
          }else {

            if (this.state.AnalysisSetting[currentPanel].imputeMissing || this.state.AnalysisSetting[currentPanel].imputedDataset) {
              codeString = codeString +
                "res <- with(" + (this.state.AnalysisSetting[currentPanel].imputeMissing ? "imputedDataset":"as.mids(currentDataset)") + ",\n  glm(" + formulaFixedPart + 
                ",\n  " + family +
                (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
                "))\npool(res)\nsummary(pool(res), conf.int = TRUE, conf.level = " + 
                this.state.AnalysisSetting[currentPanel].confLv/100 + ",\n  exponentiate = " +
                this.state.AnalysisSetting[currentPanel].expCoeff.toString().toUpperCase() + ")\n\n"

                if (this.state.AnalysisSetting[currentPanel].diagnosticPlot) {
                  codeString = codeString + "res1 <- res$analyses[[1]]\n" +
                  "car::infIndexPlot(res1)\n\n"
                }


            }else {
              codeString = codeString + "res <- glm(" + formulaFixedPart + ",\n  " + family + 
              (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
              ",\n  data = currentDataset)\nsummary(res)\nconfint(res, level = "+
              this.state.AnalysisSetting[currentPanel].confLv/100 + ", method = \"Wald\")\n\n"

              if (this.state.AnalysisSetting[currentPanel].expCoeff) {
                codeString = codeString + 
                "exp(cbind(OR = coef(res), confint(res, level = " + this.state.AnalysisSetting[currentPanel].confLv/100 + ")))\n\n"
              }

              if (this.state.AnalysisSetting[currentPanel].diagnosticPlot) {
                codeString = codeString +
                "\ncar::infIndexPlot(res)\n\n"
              }
            }
          }
        }
      break;
      case "NbPanel":
      case "MultinomPanel":
        let regType = ""
        let library = ""
        if (currentPanel === "NbPanel") {
          regType = "glm.nb"
          library = "\nlibrary(MASS)\n\n"
        }else {
          regType = "multinom"
          library = "\nlibrary(nnet)\n\n"
        }
        codeString = codeString + library
        if (this.state.AnalysisSetting[currentPanel].imputeMissing || this.state.AnalysisSetting[currentPanel].imputedDataset) {
          codeString = codeString +
          "res <- with(" + (this.state.AnalysisSetting[currentPanel].imputeMissing ? "imputedDataset":"as.mids(currentDataset)") + ",\n  " +
          regType + "(" + formulaFixedPart + 
          (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
          "))\npool(res)\nsummary(pool(res), conf.int = TRUE, conf.level = " + 
          this.state.AnalysisSetting[currentPanel].confLv/100 + ",\n  exponentiate = " +
          this.state.AnalysisSetting[currentPanel].expCoeff.toString().toUpperCase() + ")\n\n"
        }else{
          codeString = codeString + "res <- " + regType + "(" + formulaFixedPart +  
            (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
            ",\n  data = currentDataset)\nsummary(res)\n"
          
          if (currentPanel === "MultinomPanel") {
            codeString = codeString + "  summary(res)$coefficients\n" +
            "summary(res)$standard.errors\n" +
            "z <- summary(res)$coefficients/summary(res)$standard.errors\n" +
            "p <- (1 - pnorm(abs(z), 0, 1))*2\n" + 
            "p\n"

          }
            
          codeString = codeString + "confint(res, level = "+
            this.state.AnalysisSetting[currentPanel].confLv/100 + ")\n\n"

            if (this.state.AnalysisSetting[currentPanel].expCoeff) {
              if (currentPanel === "NbPanel") {
                codeString = codeString + 
                "exp(cbind(OR = coef(res), confint(res, level = " + this.state.AnalysisSetting[currentPanel].confLv/100 + ")))\n\n"
              }else {
                codeString = codeString +
                "exp(summary(res)$coefficients)\n" +
                "exp(confint(res, level = " +
                this.state.AnalysisSetting[currentPanel].confLv/100 + "))\n\n"
              }
            }
        }

      break;
      default:
      break;


    }
    if (this.state.Checked["CovariatesEMMSelection"].length > 0) {
      if (currentPanel === "LogitPanel" || currentPanel === "PoiPanel" || currentPanel === "NbPanel" || (currentPanel === "LRPanel" && !this.state.AnalysisSetting["LRPanel"].robustReg)) {
        codeString = codeString + "library(emmeans)\n\n"
        this.state.Checked["CovariatesEMMSelection"].forEach((item) => {
          let terms = item.split("*")
          let numeric = 0
          let numericCode = ",\n  cov.keep = 3, at = list("
          let settingGridLevel = ""
          terms.forEach((variable, index) => {
            if (this.props.CurrentVariableList[variable][0] === "Numeric") {
              numeric = numeric + 1

              settingGridLevel = settingGridLevel + "m_" + variable + "<- mean(currentDataset$" + variable + ", na.rm = TRUE)\n" + 
                "sd_" + variable + "<- sd(currentDataset$" + variable + ", na.rm = TRUE)\n\n"

              numericCode = numericCode + (index === 0 ? "\n  " : ",\n  ") + variable + " = c(m_" + variable + "-sd_" + variable +
                ", m_" + variable + ", m_" + variable + "+sd_" + variable + ")"
            }
          })
          numericCode = numericCode + ")"

          if (numeric > 0) {
            codeString = codeString + settingGridLevel + "\n"
          }

          codeString = codeString + "emm <- emmeans(res, " + (this.state.AnalysisSetting["Pairwise"] ? "pairwise" : "") + 
            " ~ " + item + (numeric > 0 ? numericCode : "") + (this.state.AnalysisSetting["EMMResponseScale"] ? ", type = \"response\"" : "") +", level = " +
            this.state.AnalysisSetting[currentPanel].confLv/100 + ")\nsummary(emm)\n\n"
          
          if (this.state.AnalysisSetting["Pairwise"] && currentPanel === "LRPanel") {
            if (this.state.AnalysisSetting[currentPanel].imputedDataset || this.state.AnalysisSetting[currentPanel].imputeMissing) {
              if (this.state.Variables.RandomEffect.length > 0) {
                codeString = codeString + "eff_size(emm, sigma = sigma(res$analyses[[1]]), edf = Inf)\n\n"
              }else {
                codeString = codeString + "eff_size(emm, sigma = sigma(res$analyses[[1]]), edf = res$analyses[[1]]$df.residual)\n\n"
              }
            }else {
              
              codeString = codeString + "eff_size(emm, sigma = sigma(res), edf = " + (this.state.Variables.RandomEffect.length > 0 ? "Inf" : "res$df.residual") + ")\n\n"
              
            }
          }

          if (this.state.AnalysisSetting["SimpleSlope"] && terms.length >= 2 && this.props.CurrentVariableList[terms[0]][0] === "Numeric") {
            
            let moderators = [...terms]
            moderators.shift()

            codeString = codeString + "simpleSlope <- emtrends(res, pairwise ~ " + moderators.join("*") + ", var = \"" +
              terms[0] + "\""


            if (numeric > 1) {
              let searchTerm = terms[0] + ".*?\\),"
              let regex = new RegExp(searchTerm)
              let numericCodeForSimpleSlope = numericCode.replace(regex, "")
              codeString = codeString + numericCodeForSimpleSlope
              
            }

            codeString = codeString + ", level = " + 
            this.state.AnalysisSetting[currentPanel].confLv/100 +")\nsummary(simpleSlope)\n\n"
          }
          
          if (this.state.AnalysisSetting["InteractionPlot"] && terms.length >= 2) {
            codeString = codeString + "emmip(res, " + terms[1] + " ~ " + terms[0] + (terms.length >= 3 ? " | " + terms[2] : "") +
              numericCode + ",\n  CIs = TRUE, level = " + this.state.AnalysisSetting[currentPanel].confLv/100 + ", position = \"jitter\"" + 
              (this.state.AnalysisSetting["EMMResponseScale"] ? ", type = \"response\"": "") +")\n\n"
            
          }
        })

      }
    }
   

    this.props.updateTentativeScriptCallback(codeString, this.state) 
  }

  handlePanelExpansion = (target) => (event, newExpanded) => {
    let panelsObj = {...this.state.panels}
    panelsObj[target] = !panelsObj[target]
    this.setState({panels: panelsObj})
  }

  updateAnalysisSetting = (event, targetPanel, target) => {
    let AnalysisSettingObj = _.cloneDeep(this.state.AnalysisSetting)
    

    switch (target) {
      case "robustReg":
        AnalysisSettingObj[targetPanel][target] = !AnalysisSettingObj[targetPanel][target]
        AnalysisSettingObj[targetPanel]["diagnosticPlot"] = false
        break;
      case "imputedDataset":
        AnalysisSettingObj[targetPanel][target] = !AnalysisSettingObj[targetPanel][target]
        AnalysisSettingObj[targetPanel]["imputeMissing"] = false
        if (targetPanel === "LRPanel" && this.state.Variables.RandomEffect.length >0) {
          AnalysisSettingObj[targetPanel]["robustReg"] = false
        }
        break;
      case "imputeMissing":
        AnalysisSettingObj[targetPanel][target] = !AnalysisSettingObj[targetPanel][target]
        AnalysisSettingObj[targetPanel]["imputedDataset"] = false
        if (targetPanel === "LRPanel" && this.state.Variables.RandomEffect.length >0) {
          AnalysisSettingObj[targetPanel]["robustReg"] = false
        }
        break;
      case "diagnosticPlot":
      case "expCoeff":
        AnalysisSettingObj[targetPanel][target] = !AnalysisSettingObj[targetPanel][target]
        break;
      case "M":
        AnalysisSettingObj[target] = event.target.value
        break;
      case "confLv":
        AnalysisSettingObj[targetPanel][target] = event.target.value
        break;
      case "EMMResponseScale":
      case "Pairwise":
      case "SimpleSlope":
      case "InteractionPlot":
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
    let analysisType = ""
    let currentPanel = this.props.currentActiveAnalysisPanel
    switch (this.props.currentActiveAnalysisPanel) {
      case "LRPanel":
        analysisType = "Linear Regression"
        break;
      case "LogitPanel":
        analysisType = "Logistic Regression"
        break;
      case "PoiPanel":
        analysisType = "Poison Regression"
        break;
      case "NbPanel":
        analysisType = "Negative Binomial Regression"
        break;
      case "MultinomPanel":
        analysisType = "Multinomial Logistic Regression"
        break;
      default:
        break;
    }
    return (
      <div className="mt-2">    
      {(this.props.currentActiveAnalysisPanel === "LRPanel" ||
       this.props.currentActiveAnalysisPanel === "LogitPanel" ||
       this.props.currentActiveAnalysisPanel === "PoiPanel" ||
       this.props.currentActiveAnalysisPanel === "NbPanel" ||
       this.props.currentActiveAnalysisPanel === "MultinomPanel") &&
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
              <RegVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
              sortAvailable = {this.state.sortAvailable}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>  
          <ExpansionPanel square expanded={this.state.panels.modelSpec}
          onChange = {this.handlePanelExpansion("modelSpec")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Add interaction terms</Typography>
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
          <ExpansionPanel square expanded={this.state.panels.randomEffect}
          onChange = {this.handlePanelExpansion("randomEffect")}
          hidden = {(currentPanel !== "LRPanel" && currentPanel !== "LogitPanel" && currentPanel !== "PoiPanel")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Random Effect</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <RandomEffectPanel CurrentVariableList = {this.props.CurrentVariableList}
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
              RandomSlopes = {this.state.RandomSlopes}
              CheckedRandomSlopes = {this.state.CheckedRandomSlopes}
              handleToggleSecondaryCallback = {this.handleToggleSecondary}
              addRandomSlopesCallback = {this.addRandomSlopes}
              handleToggleRECallback = {this.handleToggleRE}
              delRandomSlopesCallback = {this.delRandomSlopes}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel square expanded={this.state.panels.EMM}
          onChange = {this.handlePanelExpansion("EMM")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Estimated Marginal Means</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <EMMPanel CurrentVariableList = {this.props.CurrentVariableList}
              Variables = {this.state.Variables}
              Checked = {this.state.Checked}
              AnalysisSetting = {this.state.AnalysisSetting}
              updateAnalysisSettingCallback = {this.updateAnalysisSetting}
              intersectionCallback = {this.intersection}
              notCallback = {this.not}
              handleToggleCallback = {this.handleToggle}
              changeArrowCallback = {this.changeArrow}
              handleToRightCallback = {this.handleToRight}
              handleToLeftCallback = {this.handleToLeft}
              addExtraBlkCallback = {this.props.addExtraBlkCallback}
              EMM = {this.state.EMM}
              checkedEMM = {this.state.CheckedEMM}
              addEMMTermCallback = {this.addEMMTerm}
              delEMMTermCallback = {this.delEMMTerm}
              handleToggleEMMCallback = {this.handleToggleEMM}
              availableVarsEMM = {this.state.Variables["Covariates"].concat(this.state.interaction)}
              CovariatesEMMSelection = {this.state.Checked["CovariatesEMMSelection"]}
              currentActiveAnalysisPanel = {this.props.currentActiveAnalysisPanel}
            
              
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel square expanded={this.state.panels.analysisSetting}
          onChange = {this.handlePanelExpansion("analysisSetting")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Analysis Setting</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <RegAnalysisSetting 
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