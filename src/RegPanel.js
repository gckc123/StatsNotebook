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
        },
        RandomSlopes: {},
        CheckedRandomSlopes: {},
        interaction: [],
        checkedInteraction: [],
        hideToRight: {
            Covariates: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: false,
          modelSpec: false,
          randomEffect: false,
          analysisSetting: false,
        },
        AnalysisSetting: {
          M : 20,
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
            imputedDataset: false,
            imputeMissing: false,
            diagnosticPlot: true,
            expCoeff: true,
            confLv: 95,
          },
          MultinomPanel: {
            imputedDataset: false,
            imputeMissing: false,
            diagnosticPlot: true,
            expCoeff: true,
            confLv: 95,
          }
        }
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "LRPanel" ||
    this.props.currentActiveAnalysisPanel === "LogitPanel") {
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

          let interactionObj = this.state.interaction.filter((item) => {
            let terms = item.split("*")
            let match = this.intersection(terms, VariablesObj["Covariates"])
            if (match.length === terms.length)
              return true
            else
              return false
          })

          let checkedInteractionObj = this.intersection(this.state.checkedInteraction, interactionObj)
          let addToAvailable = this.not(CurrentVariableList, allVarsInCurrentList)
          VariablesObj["Available"] = VariablesObj["Available"].concat(addToAvailable)

          this.setState({Variables:{...VariablesObj}, 
            Checked: {...CheckedObj}, 
            interaction: [...interactionObj],
            checkedInteraction: [...checkedInteractionObj]})      
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
    let RandomSlopesObj = {...this.state.RandomSlopes}
    let CheckedRandomSlopesObj = {...this.state.CheckedRandomSlopes}
    let AnalysisSettingObj = {...this.state.AnalysisSetting}
    let toRightVars = []
    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
      
      toRightVars = CheckedObj["Available"].filter((item) =>
        this.props.CurrentVariableList[item][0] !== "Character"
      )

      if (toRightVars.length !== CheckedObj["Available"].length) {
        alert("Character variables will not be added. These variables need to be firstly converted into factor variables.")
      }

      VariablesObj["Available"] = this.not(VariablesObj["Available"],toRightVars)
      VariablesObj[target] = VariablesObj[target].concat(toRightVars)

      if (target === "RandomEffect") {
        toRightVars.forEach((item) => {
          RandomSlopesObj[item] = []
          CheckedRandomSlopesObj[item] = []
        })
        if (this.props.currentActiveAnalysisPanel === "LRPanel") {
          AnalysisSettingObj[this.props.currentActiveAnalysisPanel]["robustReg"] = false
        }
      }

      CheckedObj["Available"] = []
      this.setState({Variables: {...VariablesObj}, RandomSlopes: {...RandomSlopesObj}, 
        CheckedRandomSlopes: {...CheckedRandomSlopesObj}, AnalysisSetting: {...AnalysisSettingObj}},
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
      let RandomSlopesObj = {...this.state.RandomSlopes}
      let CheckedRandomSlopesObj = {...this.state.CheckedRandomSlopes}
      VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
      VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])

      if (from === "RandomEffect") {
        CheckedObj[from].forEach( (item) => {
          delete RandomSlopesObj[item]
          delete CheckedRandomSlopesObj[item]
        })
        
      }

      CheckedObj[from] = []
      this.setState({Variables: {...VariablesObj}, RandomSlopes: {...RandomSlopesObj}, CheckedRandomSlopes: {...CheckedRandomSlopesObj}},
          () => this.setState({Checked: {...CheckedObj}}, ()=> console.log(this.state.RandomSlopes)))
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
    this.setState({Checked: {...CheckedObj}, checkedInteraction: []})
  }

  handleToggleInteraction = (varname, from) => {
    let CheckedObj = {...this.state.Checked}
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

  handleToggleRE = (varname, from) => {
    let CheckedObj = {...this.state.Checked}
    let CheckedRandomSlopesObj = {...this.state.CheckedRandomSlopes}
    let currentIndex = CheckedRandomSlopesObj[from].indexOf(varname)

    if (currentIndex === -1) {
      CheckedRandomSlopesObj[from].push(varname)
    }else {
      CheckedRandomSlopesObj[from].splice(currentIndex, 1)
    }

    for (let key in CheckedObj) {
      CheckedObj[key] = []
    }

    this.setState({CheckedRandomSlopes: CheckedRandomSlopesObj, Checked: {...CheckedObj}}, 
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
    let RandomSlopesObj = {...this.state.RandomSlopes}
    let CheckedObj = {...this.state.Checked}

    

    let newTerm = this.not(CheckedObj["CovariatesRESelection"], RandomSlopesObj[target])

    console.log("Target")
    console.log(target)
    console.log("Current RandomSlopes Object")
    console.log(RandomSlopesObj)
    console.log("Selected RE")
    console.log(CheckedObj["CovariatesRESelection"])
    console.log("Terms to be added")
    console.log(newTerm)

    RandomSlopesObj[target] = RandomSlopesObj[target].concat(newTerm)

    console.log(RandomSlopesObj)

    CheckedObj["CovariatesRESelection"] = []
    this.setState({RandomSlopes: RandomSlopesObj, Checked: CheckedObj}, () => console.log(this.state.RandomSlopes))
  }

  delRandomSlopes = (from) => {
    console.log("Deleting...")
    let RandomSlopesObj = {...this.state.RandomSlopes}
    let CheckedRandomSlopesObj = {...this.state.CheckedRandomSlopes}
    RandomSlopesObj[from] = this.not(RandomSlopesObj[from], CheckedRandomSlopesObj[from])
    CheckedRandomSlopesObj[from] = []
    this.setState({RandomSlopes: RandomSlopesObj, CheckedRandomSlopes: CheckedRandomSlopesObj})
    
  }

  addInteractionTerm = () => {
    let interactionObj = [...this.state.interaction]
    let CheckedObj = {...this.state.Checked}
    if (CheckedObj["CovariatesIntSelection"].length <= 1) {
      alert("Please select at least two variables.")
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

    let codeString =""

    if (this.state.AnalysisSetting.LRPanel.imputeMissing) {

      if (Object.keys(this.props.CurrentVariableList).indexOf(".imp") !== -1) {
        codeString = codeString + "currentDataset <- currentDataset[which(currentDataset$.imp == 0),]\n" +
        "currentDataset <- currentDataset[!(names(currentDataset) %in% c(\".id\", \".imp\"))]\n\n"
      }   

      codeString = codeString + "library(mice)\n"
      let formula = []
      let method = []
      let formulaCode = "formula <- make.formulas(currentDataset)\n"

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

    let currentPanel = this.props.currentActiveAnalysisPanel

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
          codeString = codeString + "library(tidyverse)\n\n" + "glance.lmrob <- function(x, ...) {" +
          "\n  with(\n    summary(x),\n    tibble(\n      r.squared = r.squared," + 
          "\n      adj.r.squared = adj.r.squared,\n      df = df[[1]],\n      df.residual = df.residual(x),"+
          "\n      nobs = stats::nobs(x),\n      sigma = scale\n    )\n  )\n}" + 
          "\n\n tidy.lmrob <- function(x, ...) {" +
          "\n  y <- summary(x)\n  tibble(\n    term = rownames(y$coefficients),\n    estimate = y$coefficients[,\"Estimate\"]," +
          "\n    std.error = y$coefficients[,\"Std. Error\"],\n    statistics = y$coefficients[,\"t value\"]," + 
          "\n    p.value = y$coefficients[,\"Pr(>|t|)\"]\n  )\n}\n\n" 
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

        }else {

          if (this.state.Variables.RandomEffect.length > 0) {
            codeString = codeString + "\nlibrary(lme4)\n\n"
            if (this.state.AnalysisSetting[currentPanel].imputeMissing || this.state.AnalysisSetting[currentPanel].imputedDataset) {
              codeString = codeString +
              "res <- with(" + (this.state.AnalysisSetting[currentPanel].imputeMissing ? "imputedDataset":"as.mids(currentDataset)") + ",\n  lmer(" + formulaFixedPart + 
              formulaRandompart + (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
              "))\npool(res)\nsummary(pool(res), conf.int = TRUE, conf.level = " + 
              this.state.AnalysisSetting[currentPanel].confLv/100 + ")\n\n"

              if (this.state.AnalysisSetting[currentPanel].diagnosticPlot) {
                codeString = codeString + "res1 <- res$analyses[[1]]\n" +
                "library(car)\n\nplot(res1, ylab=\"Standardized Residuals\")" +
                "\noutlierTest(res1)\ninfIndexPlot(res1)\nqqnorm(residuals(res1))\nqqline(residuals(res1))\nvif(res1)"
              }

            }else{
              codeString = codeString + "res <- lmer(" + formulaFixedPart + 
                formulaRandompart + (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
                ",\n  data = currentDataset)\nsummary(res)\nconfint(res, level = "+
                this.state.AnalysisSetting[currentPanel].confLv/100 + ")\n\n"
              if (this.state.AnalysisSetting[currentPanel].diagnosticPlot) {
                codeString = codeString + "library(car)\n\nplot(res, ylab=\"Standardized Residuals\")" +
                "\noutlierTest(res)\ninfIndexPlot(res)\nqqnorm(residuals(res))\nqqline(residuals(res))\nvif(res)"
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
                "library(car)\n\nres1.std <- rstandard(res1)\nplot(res1.std, ylab=\"Standardized Residuals\")" +
                "\noutlierTest(res1)\ninfIndexPlot(res1)\nresidualPlots(res1)\nqqnorm(res1$resid)\nqqline(res1$resid)\nvif(res1)"
              }

            }else {
              codeString = codeString + "res <- lm(" + formulaFixedPart + 
              (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
              ",\n  data=currentDataset)\nsummary(res)\nconfint(res, level = " +
              this.state.AnalysisSetting[currentPanel].confLv/100 + ")\n\n"

              if (this.state.AnalysisSetting[currentPanel].diagnosticPlot) {
                codeString = codeString + "library(car)\n\nres.std <- rstandard(res)\nplot(res.std, ylab=\"Standardized Residuals\")" +
                "\noutlierTest(res)\ninfIndexPlot(res)\nresidualPlots(res)\nqqnorm(res1$resid)\nqqline(res$resid)\nvif(res)"
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
            codeString = codeString + "\nlibrary(lme4)\n\n"

            if (this.state.AnalysisSetting[currentPanel].imputeMissing || this.state.AnalysisSetting[currentPanel].imputedDataset) {
              codeString = codeString +
                "res <- with(" + (this.state.AnalysisSetting[currentPanel].imputeMissing ? "imputedDataset":"as.mids(currentDataset)") + ",\n  glmer(" + formulaFixedPart + 
                formulaRandompart + ",\n  " + family +
                (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
                "))\npool(res)\nsummary(pool(res), conf.int = TRUE, conf.level = " + 
                this.state.AnalysisSetting[currentPanel].confLv/100 + ",\n  exponentiate = " +
                this.state.AnalysisSetting[currentPanel].expCoeff.toString().toUpperCase() + ")\n\n"
            }else
            {
              codeString = codeString + "res <- glmer(" + formulaFixedPart + 
                formulaRandompart + ",\n  " + family + 
                (this.state.Variables.Weight.length >0 ? ",\n  weights = "+ this.state.Variables.Weight[0]: "") +
                ",\n  data = currentDataset)\nsummary(res)\nconfint(res, level = "+
                this.state.AnalysisSetting[currentPanel].confLv/100 + ")\n\n"

                if (this.state.AnalysisSetting[currentPanel].expCoeff)
                  codeString = codeString +
                  "se <- sqrt(diag(vcov(res)))\n" +
                  "z <- -qnorm((1-" + this.state.AnalysisSetting[currentPanel].confLv/100 + ")/2)\n" +
                  "exp(cbind(Est=fixef(res), LL = fixef(res) - z*se, UL = fixef(res) + z*se))\n\n"
            }
          }else {

          }
        }
      break;
    }
   

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
      case "robustReg":
        AnalysisSettingObj[targetPanel][target] = !AnalysisSettingObj[targetPanel][target]
        AnalysisSettingObj[targetPanel]["diagnosticPlot"] = false
        break;
      case "imputedDataset":
        AnalysisSettingObj[targetPanel][target] = !AnalysisSettingObj[targetPanel][target]
        AnalysisSettingObj[targetPanel]["imputeMissing"] = false
        break;
      case "imputeMissing":
        AnalysisSettingObj[targetPanel][target] = !AnalysisSettingObj[targetPanel][target]
        AnalysisSettingObj[targetPanel]["imputedDataset"] = false
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
      default:
        break;
    }

    this.setState({AnalysisSetting: {...AnalysisSettingObj}})
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
    )
  }
}