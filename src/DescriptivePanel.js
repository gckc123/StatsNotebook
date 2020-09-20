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
import { DescriptiveVariableSelection } from './DescriptiveVariableSelection';
import { DescriptiveAnalysisSetting } from './DescriptiveAnalysisSetting';
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


export class DescriptivePanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            SplitBy: [],
            Targets: [],
            Weight: [],
        }, 
        TargetsCat : [], 
        TargetsNum :[],
        Checked: {
            Available: [],
            SplitBy: [],
            Targets: [],
            Weight: [],
        },
        hideToRight: {
            SplitBy: false,
            Targets: false,
            Weight: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: true,
          analysisSetting: false,
        },
        AnalysisSetting: {
          OriginalData: true,
          Mean: true,
          Median: false,
          SD: true,
          Variance: false,
          IQR: false,
          MaxMin: false,
          Q2575: false,
          Skewness: false,
          Kurtosis: false,
          Normality: false,
          QQPlot: true,
          CorrelationMatrix: false,
          Spearman: false,
          Histogram: true,
          Density: false,
          Boxplot: false,
          ScatterplotMatrix: false,
          BarChart: true,

        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
        sortAvailable: false,
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "DescriptivePanel" && !this.props.setPanelFromNotebook) {
      let VariablesObj = _.cloneDeep(this.state.Variables)
      let CheckedObj = _.cloneDeep(this.state.Checked)
      let CurrentVariableList = Object.keys(this.props.CurrentVariableList).filter((item) => (item !== ".imp" && item !== ".id"))
      let CurrentVariableListByFileOrder = [...CurrentVariableList]
      let allVarsInCurrentList = []
      let TargetsCatArr = [...this.state.TargetsCat]
      let TargetsNumArr = [...this.state.TargetsNum]

      for (let key in this.state.Variables) {   
          allVarsInCurrentList = allVarsInCurrentList.concat(this.state.Variables[key])
      }

      if (JSON.stringify(CurrentVariableList.sort()) !== JSON.stringify(allVarsInCurrentList.sort())) {
          for (let key in this.state.Variables) {
              VariablesObj[key] = this.intersection(VariablesObj[key], CurrentVariableList)
              CheckedObj[key] = this.intersection(CheckedObj[key],VariablesObj[key])
          }

          TargetsCatArr = this.intersection(TargetsCatArr, VariablesObj["Targets"])
          TargetsNumArr = this.intersection(TargetsNumArr, VariablesObj["Targets"])

          let addToAvailable = this.not(CurrentVariableList, allVarsInCurrentList)
          VariablesObj["Available"] = VariablesObj["Available"].concat(addToAvailable)

          if (this.state.sortAvailable) {
            VariablesObj["Available"].sort()
          }else{
            VariablesObj["Available"] = this.intersection(CurrentVariableListByFileOrder, VariablesObj["Available"])
          }

          this.setState({Variables:{...VariablesObj}, TargetsCat: [...TargetsCatArr], TargetsNum: [...TargetsNumArr], Checked: {...CheckedObj}})
      }
    }else if((this.props.currentActiveAnalysisPanel === "DescriptivePanel" && this.props.setPanelFromNotebook)) {
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
      TargetsCat: [],
      TargetsNum: [],
    })

  }

  handleToRight = (target, maxElement) => {
    let VariablesObj = _.cloneDeep(this.state.Variables)
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let toRightVars = []
    let toRightVarsCat = [] 
    let toRightVarsNum = []
    let TargetsCatArr = [...this.state.TargetsCat]
    let TargetsNumArr = [...this.state.TargetsNum]

    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
      if (target === "SplitBy") {

        toRightVars = CheckedObj["Available"].filter((item) =>
          this.props.CurrentVariableList[item][0] !== "Character"

        )

        if (toRightVars.length !== CheckedObj["Available"].length) {
          this.setState({showAlert: true, 
            alertText: "Character variables will not be added. These variables need to be firstly converted into factor variables.",
            alertTitle: "Alert"
          })
        }

      }else if (target === "Targets") {
        
        toRightVars = CheckedObj["Available"].filter((item) =>
          this.props.CurrentVariableList[item][0] !== "Character"
        )

        if (toRightVars.length !== CheckedObj["Available"].length) {
          this.setState({showAlert: true, 
            alertText: "Character variables will not be added. These variables need to be firstly converted into factor variables.",
            alertTitle: "Alert"
          })
        }
        

        toRightVarsCat = toRightVars.filter((item) =>
          this.props.CurrentVariableList[item][0] === "Factor"
        )

        toRightVarsNum = toRightVars.filter((item) => 
          this.props.CurrentVariableList[item][0] === "Numeric"
        )

        TargetsCatArr = TargetsCatArr.concat(toRightVarsCat)
        TargetsNumArr = TargetsNumArr.concat(toRightVarsNum)
      }else if (target === "Weight") {
        toRightVars = CheckedObj["Available"].filter((item) =>
          this.props.CurrentVariableList[item][0] === "Numeric"

        )

        if (toRightVars.length !== CheckedObj["Available"].length) {
          this.setState({showAlert: true, 
            alertText: "Only numeric variable can be used as weighting variable.",
            alertTitle: "Alert"
          })
        }
      }

      VariablesObj["Available"] = this.not(VariablesObj["Available"],toRightVars)
      VariablesObj[target] = VariablesObj[target].concat(toRightVars)
      CheckedObj["Available"] = []
      this.setState({Variables: {...VariablesObj}, TargetsCat: [...TargetsCatArr], TargetsNum: [...TargetsNumArr]},
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
      let TargetsCatArr = [...this.state.TargetsCat]
      let TargetsNumArr = [...this.state.TargetsNum]
      VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
      VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])

      if (this.state.sortAvailable) {
        VariablesObj["Available"].sort()
      }else{
        VariablesObj["Available"] = this.intersection(Object.keys(this.props.CurrentVariableList).filter((item) => (item !== ".imp" && item !== ".id")), VariablesObj["Available"])
      }


      if (from === "Targets") {
        TargetsCatArr = this.not(TargetsCatArr, CheckedObj[from])
        TargetsNumArr = this.not(TargetsNumArr, CheckedObj[from])
      }

      CheckedObj[from] = []
      this.setState({Variables: {...VariablesObj}, TargetsCat: [...TargetsCatArr], TargetsNum: [...TargetsNumArr], Checked: {...CheckedObj}})
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
    let codeString = "library(tidyverse)\nlibrary(e1071)\nlibrary(ggplot2)\nlibrary(GGally)\n\n"
    
    if (this.state.Variables["Weight"].length > 0) {
      codeString = codeString + "library(survey)\n\n"
    }

    let dataset = ""
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

    let analysisVars = this.state.Variables["Targets"].concat(this.state.Variables["SplitBy"])

    codeString = codeString + "print(\"Sample size and missing data\")\n\n"
    codeString = codeString + dataset + " %>%\n  summarize(count = n()" 
    analysisVars.forEach((item) => {
      codeString = codeString + ", \n  mis_" + item + " = sum(is.na(" + item + "))"
    })
    codeString = codeString + "\n  )\n\n"
    


    if (this.state.Variables.Weight.length === 0) {
      codeString = codeString + "print(\"Descriptive Statistics\")\n\n"
      if (this.state.TargetsNum.length > 0) {
        codeString = codeString + dataset + " %>%\n  "
        if (this.state.Variables["SplitBy"].length > 0) {
          codeString = codeString + "group_by(" + this.state.Variables["SplitBy"].join(", ") + ") %>%\n  "  
        }
        codeString = codeString + "summarize(count = n()"

        if (this.state.AnalysisSetting["Mean"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString = codeString + ",\n  M_" + item + " = mean(" + item + ", na.rm = TRUE)"
          })
        }

        if (this.state.AnalysisSetting["Median"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString = codeString + ",\n  Mdn_" + item + " = median(" + item + ", na.rm = TRUE)"
          })
        }

        if (this.state.AnalysisSetting["SD"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString = codeString + ",\n  SD_" + item + " = sd(" + item + ", na.rm = TRUE)"
          })
        }

        if (this.state.AnalysisSetting["Variance"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString = codeString + ",\n  Var_" + item + " = var(" + item + ", na.rm = TRUE)"
          })
        }

        if (this.state.AnalysisSetting["IQR"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString = codeString + ",\n  IQR_" + item + " = IQR(" + item + ", na.rm = TRUE)"
          })
        }

        if (this.state.AnalysisSetting["MaxMin"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString = codeString + ",\n  Min_" + item + " = min(" + item + ", na.rm = TRUE)"
            codeString = codeString + ",\n  Max_" + item + " = max(" + item + ", na.rm = TRUE)"
          })
        }
        
        if (this.state.AnalysisSetting["Q2575"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString = codeString + ",\n  Q25_" + item + " = quantile(" + item + ", probs = 0.25, na.rm = TRUE)"
            codeString = codeString + ",\n  Q75_" + item + " = quantile(" + item + ", probs = 0.75, na.rm = TRUE)"
          })
        }

        if (this.state.AnalysisSetting["Skewness"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString = codeString + ",\n  Skew_" + item + " = skewness(" + item + ", na.rm = TRUE)"
          })
        }

        if (this.state.AnalysisSetting["Kurtosis"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString = codeString + ",\n  Kurt_" + item + " = kurtosis(" + item + ", na.rm = TRUE)"
          })
        }

        if (this.state.AnalysisSetting["Normality"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString = codeString + ",\n  Norm_" + item + " = shapiro.test(" + item + ")$p.value"
          })
        }

        codeString = codeString + "\n  ) %>% \n  print(width = 1000, n = 500)\n" 
        
        if (this.state.AnalysisSetting["QQPlot"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString =  codeString + "\nggplot("+ dataset + ") +\n  geom_qq(aes(sample=" + 
            item + "))"
            if (this.state.Variables["SplitBy"].length > 0) {
              codeString = codeString + " +\n  facet_wrap(~"+  this.state.Variables["SplitBy"].join(" + ") +")"
            }
            codeString = codeString + "\n"
          })
        }

        if (this.state.TargetsNum.length > 1 && this.state.AnalysisSetting["CorrelationMatrix"]) {
          if (this.state.Variables["SplitBy"].length === 0) {
            codeString = codeString + "\n"+ dataset +" %>% select(" + this.state.TargetsNum.join(", ")+") %>%\n  as.matrix() %>% Hmisc::rcorr("+ 
            (this.state.AnalysisSetting.Spearman ? ", type = \"spearman\"": "")+ ")"
          }else {
            codeString = codeString + "\n"+ dataset +" %>% split(list(.$" + this.state.Variables["SplitBy"].join(", .$") + ")) %>% \n  map(select, c(" +
              this.state.TargetsNum.join(", ") +")) %>%\n  map(as.matrix) %>% map(Hmisc::rcorr"+ 
              (this.state.AnalysisSetting.Spearman ? ", type =\"spearman\"": "") +")" 
          }
          codeString = codeString + "\n"
        }

        if (this.state.AnalysisSetting["Histogram"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString =  codeString + "\nggplot("+ dataset +") +\n  geom_histogram(aes(x=" + 
            item + "), color = \"white\")"
            if (this.state.Variables["SplitBy"].length > 0) {
              codeString = codeString + " +\n  facet_wrap(~"+  this.state.Variables["SplitBy"].join(" + ") +")"
            }
            codeString = codeString + "\n"
          })
        }

        if (this.state.AnalysisSetting["Density"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString =  codeString + "\nggplot("+ dataset +") +\n  geom_density(aes(x=" + 
            item + "))"
            if (this.state.Variables["SplitBy"].length > 0) {
              codeString = codeString + " +\n  facet_wrap(~"+  this.state.Variables["SplitBy"].join(" + ") +")"
            }
            codeString = codeString + "\n"
          })
        }

        if (this.state.AnalysisSetting["Boxplot"]) {
          this.state.TargetsNum.forEach((item) => {
            codeString =  codeString + "\nggplot("+ dataset +") +\n  geom_boxplot(aes(y=" + 
            item + (this.state.Variables["SplitBy"].length > 0 ? ", x="+ this.state.Variables["SplitBy"][0] : "") + 
            (this.state.Variables["SplitBy"].length >1 ? ", fill = "+ this.state.Variables["SplitBy"][1] : "") + "))"
            if (this.state.Variables["SplitBy"].length > 2) {
              codeString = codeString + " +\n  facet_wrap(~" +  this.state.Variables["SplitBy"][2] +
              (this.state.Variables["SplitBy"].length > 3 ? " + " + this.state.Variables["SplitBy"][3] : "" ) + ")"
            }
            codeString = codeString + "\n"
          })
        }

        if (this.state.AnalysisSetting["ScatterplotMatrix"]) {
          codeString = codeString + "\n"+ dataset + " %>% select(" + this.state.TargetsNum.join(", ")+") %>%\n  ggpairs(progress = FALSE)\n\n" 
        }
      }
      
      if (this.state.TargetsCat.length > 0) {
        
        this.state.TargetsCat.forEach((item) => {
          codeString = codeString + dataset + " %>%\n  drop_na(" + item + ") %>%\n  " + 
            (this.state.Variables["SplitBy"].length > 0 ? "group_by(" + this.state.Variables["SplitBy"].join(", ") + ", "+ item
            +") %>%\n  " : "group_by("+ item + ") %>%\n  ") +
            "summarize(count = n()) %>% \n  spread(key = " + 
            item + ", value = count)\n\n"

        })      

        

        if (this.state.AnalysisSetting["BarChart"]) {
          this.state.TargetsCat.forEach((item) => {
            codeString =  codeString + "\nggplot("+ dataset +") +\n  geom_bar(stat = \"count\", aes(x=" + 
            item + 
            (this.state.Variables["SplitBy"].length > 0 ? ", fill = "+ this.state.Variables["SplitBy"][0] + "), position=position_dodge()" : ")") + ")"
            if (this.state.Variables["SplitBy"].length > 1) {
              codeString = codeString + " +\n  facet_wrap(~" +  this.state.Variables["SplitBy"][1] +
              (this.state.Variables["SplitBy"].length > 2 ? " + " + this.state.Variables["SplitBy"][2] : "" ) + ")"
            }
            codeString = codeString + "\n"
          })
        }
      }
    }else {
      codeString = codeString + "clus <- svydesign(id=~1, weights =~ "+ 
      this.state.Variables.Weight[0] +", data = "+ dataset +")\n\n"
      this.state.TargetsNum.forEach((item) => {
        if (this.state.AnalysisSetting["Mean"]) {
          codeString = codeString + "svymean(~" + item + ", clus, na.rm = TRUE)\n"
        }
        if (this.state.AnalysisSetting["Median"] || (this.state.AnalysisSetting["Q2575"])) {
          codeString = codeString + "svyquantile(~" + item + ", clus, c(.25, .50, .75),  na.rm = TRUE)\n"
        }
        codeString = codeString + "\n"
      })
      this.state.TargetsCat.forEach((item) => {
        codeString = codeString + "svymean(~" + item + ", clus, na.rm = TRUE)\n\n"
      })
    }

    codeString = codeString + "\n\"Chan, G. and StatsNotebook Team (2020). StatsNotebook. (Version "+ this.props.currentVersion +") [Computer Software]. Retrieved from https://www.statsnotebook.io\"\n"+
      "\"R Core Team (2020). The R Project for Statistical Computing. [Computer software]. Retrieved from https://r-project.org\"\n"
    this.props.updateTentativeScriptCallback(codeString, this.state) 
  }

  handlePanelExpansion = (target) => (event, newExpanded) => {
    let panelsObj = {...this.state.panels}
    panelsObj[target] = !panelsObj[target]
    this.setState({panels: {...panelsObj}})
  }

  updateAnalysisSetting = (event,target) => {
    let AnalysisSettingObj = {...this.state.AnalysisSetting}
    
    switch (target) {
      case "Mean":
      case "Median":
      case "SD":
      case "Variance":
      case "IQR":
      case "MaxMin":
      case "Q2575":
      case "Skewness":
      case "Kurtosis":
      case "Normality":
      case "QQPlot":
      case "CorrelationMatrix":
      case "Spearman":
      case "Histogram":
      case "Density":
      case "Boxplot":
      case "ScatterplotMatrix":
      case "BarChart":
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
      {this.props.currentActiveAnalysisPanel === "DescriptivePanel" &&
        <div>
          <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
          title = {this.state.alertTitle}
          content = {this.state.alertText}></Alert>            
          <ExpansionPanel square expanded={this.state.panels.variableSelection}
          onChange = {this.handlePanelExpansion("variableSelection")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Explore - Variable selection</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <DescriptiveVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
              <Typography>Statistics and plots</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <DescriptiveAnalysisSetting 
                Variables = {this.state.Variables}
                CategoricalVarLevels = {this.props.CategoricalVarLevels}
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