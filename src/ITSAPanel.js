import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ITSAVariableSelection } from './ITSAVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { ITSAAnalysisSetting } from "./ITSAAnalysisSetting";
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


export class ITSAPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            Outcome: [],
            Time: [],
            Intervention: [],
            Control: [],
            Covariates: [],
        }, 
        Checked: {
            Available: [],
            Outcome: [],
            Time: [],
            Intervention: [],
            Control: [],
            Covariates: [],
        },

        hideToRight: {
            Outcome: false,
            Time: false,
            Intervention: false,
            Control: false,
            Covariates: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: true,
          modelSpec: false,
          analysisSetting: false,
        },
        AnalysisSetting: {
          ConfLv: 95,
          Plot: true,
          ACF: false,
          Harmonic: false,
          HarmonicPair: 1,
          HarmonicPeriod: 12,
          PhaseIn: false,
          PhaseInStart: 0,
          PhaseInEnd: 0,
          AutoCorrelation: 1

        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
        sortAvailable: false,
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "ITSAPanel" && !this.props.setPanelFromNotebook) {
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
            Checked: {...CheckedObj}})      
      }
    }else if((this.props.currentActiveAnalysisPanel === "ITSAPanel" && this.props.setPanelFromNotebook)) {
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

  handleToRight = (target, maxElement) => {
    let VariablesObj = _.cloneDeep(this.state.Variables)
    let CheckedObj = _.cloneDeep(this.state.Checked)

    if (CheckedObj["Available"].length > 0) {
      if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
        if ((target === "Time" || target === "Outcome") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] !== "Numeric")) {
          this.setState({showAlert: true, 
            alertText: "Only numeric variable can be entered as Outcome or Time.",
            alertTitle: "Alert"
          })
        }else if ((target === "Intervention" || target === "Control") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] !== "Factor")) {
          this.setState({showAlert: true, 
            alertText: "Only factor variable can be entered as Intervention or Control.",
            alertTitle: "Alert"
          })
        }else {
          VariablesObj["Available"] = this.not(VariablesObj["Available"],CheckedObj["Available"])
          VariablesObj[target] = VariablesObj[target].concat(CheckedObj["Available"])
          CheckedObj["Available"] = []
          this.setState({Variables: {...VariablesObj}},
              () => this.setState({Checked: {...CheckedObj}}))  
        }      
      }else{
          if (CheckedObj["Available"].length > 0) {
              this.setState({showAlert: true, 
                alertText: "Only "+ maxElement + " " + target + " variable(s) can be specified.",
                alertTitle: "Alert"
              })
          }
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

    let codeString = "library(nlme)\nlibrary(tsModel)\n\n"
    
    try {
      if (this.state.AnalysisSetting.Harmonic) {

        for (let i = 0; i < this.state.AnalysisSetting.HarmonicPair*2; i++) {
          codeString = codeString + "currentDataset$harmonic" + (i+1).toString() + " <- NULL\n"
        }

        codeString = codeString + "currentDataset <- cbind(currentDataset, data.frame(harmonic(currentDataset$"+ this.state.Variables.Time[0] +
        ", "+ this.state.AnalysisSetting.HarmonicPair +", "+ this.state.AnalysisSetting.HarmonicPeriod+")))\n" + "currentDataset <- currentDataset %>% \n" +
        "  rename(harmonic1 = X1"

        for (let i = 1; i < this.state.AnalysisSetting.HarmonicPair*2; i++) {
          codeString = codeString + ",\n" + "         harmonic" + (i+1).toString() + " = X" + (i+1).toString() + ""
        }      

        codeString = codeString + ")\n\n"
      }

      let analysisDataset = "currentDataset"

      if (this.state.AnalysisSetting.PhaseIn) {
        codeString = codeString + "analysisDataset <- currentDataset %>%\n" +
          "  filter(" + this.state.Variables.Time[0] + "<" + this.state.AnalysisSetting.PhaseInStart + " | " +
          this.state.Variables.Time[0] + ">" + this.state.AnalysisSetting.PhaseInEnd + ")\n\n"
        analysisDataset = "analysisDataset"
      }

      codeString = codeString + "res <- gls(" + this.state.Variables.Outcome[0] + " ~ " + 
        this.state.Variables.Time[0] + "*" + this.state.Variables.Intervention[0] + 
        (this.state.Variables.Control.length > 0 ? "*" + this.state.Variables.Control[0] : "") +
        (this.state.Variables.Covariates.length > 0? "+" + this.state.Variables.Covariates.join(" + "): "")

      if (this.state.AnalysisSetting.Harmonic) {
        for (let i = 0; i < this.state.AnalysisSetting.HarmonicPair*2;  i++) {
          codeString = codeString + " + harmonic" + (i+1).toString()
        }
      }

      codeString = codeString + ",\n  data = " + analysisDataset + ( this.state.AnalysisSetting.AutoCorrelation > 0 ?",\n  correlation = corARMA(p = " + 
        this.state.AnalysisSetting.AutoCorrelation + ", form =~ " + this.state.Variables.Time[0] +
        (this.state.Variables.Control.length > 0 ? " | " + this.state.Variables.Control[0] : "") + ")" : "")+ ", method = \"ML\")" +
        "\nsummary(res)\n\n"
      
      if (this.state.AnalysisSetting.ACF) {
        
        if (this.state.Variables.Control.length === 0) {
          codeString = codeString +  "acf(residuals(res))\nacf(residuals(res), type = \"partial\")\n\n"
        }else {
          
          codeString = codeString + analysisDataset + "$residuals <- residuals(res)\n"+
            "acf(" + analysisDataset + "["+ analysisDataset + "$"+ this.state.Variables.Control[0] +" == \""+ this.props.CategoricalVarLevels[this.state.Variables.Control[0]][0] + "\",]$residuals)\n" +
            "acf(" + analysisDataset + "["+ analysisDataset + "$"+ this.state.Variables.Control[0] +" == \""+ this.props.CategoricalVarLevels[this.state.Variables.Control[0]][0] + "\",]$residuals, type = \"partial\")\n"
            if (this.props.CategoricalVarLevels[this.state.Variables.Intervention[0]].length > 1) {
              codeString = codeString + "acf(" + analysisDataset + "["+ analysisDataset + "$"+ this.state.Variables.Control[0] +" == \""+ this.props.CategoricalVarLevels[this.state.Variables.Control[0]][1] + "\",]$residuals)\n" +
              "acf(" + analysisDataset + "["+ analysisDataset + "$"+ this.state.Variables.Control[0] +" == \""+ this.props.CategoricalVarLevels[this.state.Variables.Control[0]][1] + "\",]$residuals, type = \"partial\")\n\n"
            }      
        }
      }
      
      if (this.state.AnalysisSetting.Plot) {

        codeString = codeString + analysisDataset + "$predicted <- res$fitted\n"
        if (this.state.Variables.Control.length > 0) {
          codeString = codeString + "groups = interaction("+ analysisDataset+"$"+ this.state.Variables.Intervention[0]+","+analysisDataset+"$"+
            this.state.Variables.Control[0]+")\n\n"
        }
        
        if (this.state.AnalysisSetting.Harmonic) {
          codeString = codeString + analysisDataset + ".linear <- " + analysisDataset + "\n"
          for (let i = 0; i < this.state.AnalysisSetting.HarmonicPair*2;  i++) {
            codeString = codeString + analysisDataset + ".linear$harmonic" + (i+1).toString() + " <- 0\n"
          }
          codeString = codeString + "\n" + analysisDataset + ".linear$predicted <- predict(res, " + analysisDataset + ".linear)\n\n"
        }
        
        

        

        codeString = codeString + "plot <- ggplot() +\n  geom_point(data = " + analysisDataset + ", aes(y = " + this.state.Variables.Outcome[0] + ", x = " +
          this.state.Variables.Time[0] + (this.state.Variables.Control.length > 0? ", color = " + this.state.Variables.Control[0]:"") + ")) +\n" +
          "  geom_line(data = " + analysisDataset + ", aes(y = predicted, x = " + this.state.Variables.Time[0] +
          (this.state.Variables.Control.length > 0? ", color = " + this.state.Variables.Control[0]:"") + ", group = " + 
          (this.state.Variables.Control.length > 0? "groups" : this.state.Variables.Intervention[0]) + ")"+ (this.state.AnalysisSetting.Harmonic? ", linetype = \"dashed\"":"")+") +\n"

        if (this.state.AnalysisSetting.Harmonic) {
          codeString = codeString + "  geom_line(data = " + analysisDataset + ".linear, aes(y = predicted, x = " + this.state.Variables.Time[0] +
          (this.state.Variables.Control.length > 0? ", color = " + this.state.Variables.Control[0]:"") + ", group = " + 
          (this.state.Variables.Control.length > 0? "groups" : this.state.Variables.Intervention[0]) + ")) +\n"
        }

        if (this.state.AnalysisSetting.PhaseIn) {
          codeString = codeString + "  geom_point(data = currentDataset %>% filter("+ this.state.Variables.Time[0] +" >= "+
            + this.state.AnalysisSetting.PhaseInStart + " & "+ this.state.Variables.Time[0]+" <= "+ this.state.AnalysisSetting.PhaseInEnd + 
            "), aes(y = " + this.state.Variables.Outcome[0] + ", x = " + this.state.Variables.Time[0] + (this.state.Variables.Control.length > 0? ", color = " + this.state.Variables.Control[0]:"") +
            "), alpha = 0.3) +\n" 
        }
        
        if (this.state.Variables.Intervention.length > 0) {
          console.log(this.props.CategoricalVarLevels[this.state.Variables.Intervention[0]].length)
          for (let i = 0; i < this.props.CategoricalVarLevels[this.state.Variables.Intervention[0]].length-1 ; i++) {
            codeString = codeString + "  geom_vline(xintercept = max((" + analysisDataset + " %>% filter("+ this.state.Variables.Intervention[0]+
              " == \""+ this.props.CategoricalVarLevels[this.state.Variables.Intervention[0]][i]+"\"))$"+ this.state.Variables.Time[0] + "), linetype = \"dashed\") +\n"
          }
        }

        codeString = codeString + "  theme_bw(base_family = \"sans\") +\n  theme(legend.position = \"bottom\")\n\nplot\n\n"
        
      }

      console.log(this.state.Variables.Intervention)
      console.log(this.props.CategoricalVarLevels)
      
      


      this.props.updateTentativeScriptCallback(codeString, this.state) 
    }
    catch(err) {
      console.log(err.message)
    }

  }

  handlePanelExpansion = (target) => (event, newExpanded) => {
    let panelsObj = {...this.state.panels}
    panelsObj[target] = !panelsObj[target]
    this.setState({panels: panelsObj})
  }

  updateAnalysisSetting = (event,target) => {
    let AnalysisSettingObj = {...this.state.AnalysisSetting}
    
    switch (target) {
      case "ConfLv":
      case "HarmonicPair":
      case "HarmonicPeriod":
      case "PhaseInStart":
      case "PhaseInEnd":      
      case "AutoCorrelation":
        AnalysisSettingObj[target] = event.target.value
        break;
      case "ACF":
      case "Harmonic":
      case "PhaseIn":
      case "Plot":
      
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
      {this.props.currentActiveAnalysisPanel === "ITSAPanel" &&
        <div>  
          <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
          title = {this.state.alertTitle}
          content = {this.state.alertText}></Alert>        
          <ExpansionPanel square expanded={this.state.panels.variableSelection}
          onChange = {this.handlePanelExpansion("variableSelection")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Interrupted Time Series Analysis</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <ITSAVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
              <ITSAAnalysisSetting 
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