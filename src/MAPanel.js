import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MAVariableSelection } from './MAVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { MAAnalysisSetting } from "./MAAnalysisSetting";
import { AddInteraction } from './AddInteractions';

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


export class MAPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            StudyLab: [],
            EffectSize: [],
            SE: [],
            Covariates: [],
        }, 
        Checked: {
            Available: [],
            StudyLab: [],
            EffectSize: [],
            SE: [],
            Covariates: [],
            CovariatesIntSelection: [],
        },
        interaction: [],
        checkedInteraction: [],
        hideToRight: {
            StudyLab: false,
            EffectSize: false,
            SE: false,
            Covariates: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: false,
          modelSpec: false,
          analysisSetting: false,
        },
        AnalysisSetting: {
          ConfLv: 95,
          Exponentiate: false,
          FixedEffect: false,
          Leave1Out: true,
          TrimAndFill: true,
          ForestPlot: true,
          FunnelPlot: true,
          DiagnosticPlot: true,
        }
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "MAPanel") {
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

          VariablesObj["Available"].sort()

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


  handleToRight = (target, maxElement) => {
    let VariablesObj = {...this.state.Variables}
    let CheckedObj = {...this.state.Checked}

    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
      if ((target === "EffectSize" || target === "SE") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] !== "Numeric")) {
        alert("Only numeric variable can be entered as Effect Size or Standard Error")
      }else if ((target === "StudyLab") && (this.props.CurrentVariableList[CheckedObj["Available"][0]][0] === "Numeric")) {
        alert("Study Labels must not be a numeric variable.")
      }else {
        VariablesObj["Available"] = this.not(VariablesObj["Available"],CheckedObj["Available"])
        VariablesObj[target] = VariablesObj[target].concat(CheckedObj["Available"])
        CheckedObj["Available"] = []
        this.setState({Variables: {...VariablesObj}},
            () => this.setState({Checked: {...CheckedObj}}))  
      }      
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
    let codeString = "ma_res <- rma( yi = " + this.state.Variables.EffectSize + 
    ",\n vi = " + this.state.Variables.SE + 
    (this.state.Variables.Covariates.length > 0 ? (",\n mod = ~ " + this.state.Variables.Covariates.join(" + ") +
     (this.state.interaction.length > 0 ?  (" + " + this.state.interaction.join(" + ")): "") ) : "") + 
    ",\n data = currentDataset,\n level = " + this.state.AnalysisSetting.ConfLv/100 +
    ",\n " + (this.state.AnalysisSetting.FixedEffect ? "method=\"FE\"" : "") + ")" +
    "\nsummary(ma_res) \n" +
    (this.state.AnalysisSetting.ForestPlot ? ("\nforest(ma_res" + 
    (this.state.Variables.StudyLab.length > 0 ? (", slab = currentDataset$" + this.state.Variables.StudyLab) : "") + 
    (this.state.AnalysisSetting.Exponentiate ? ", atransf = exp)": ")")) : "") +
    (this.state.AnalysisSetting.FunnelPlot ? ("\n\nfunnel(ma_res)\nregtest(ma_res)") : "") +
    (this.state.AnalysisSetting.DiagnosticPlot ? ("\n\nqqnorm(ma_res)\ninf <- influence(ma_res) \nplot(inf)") : "") + 
    (this.state.AnalysisSetting.Leave1Out && this.state.Variables.Covariates.length === 0 ? ("\n\nleave1out(ma_res)") : "") +
    (this.state.AnalysisSetting.TrimAndFill && this.state.Variables.Covariates.length === 0 ? ("\n\nma_res_tf <- trimfill(ma_res)\nsummary(ma_res_tf)\nfunnel(ma_res_tf)") : "")
    
    this.props.updateTentativeScriptCallback(codeString) 
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
        AnalysisSettingObj[target] = event.target.value
        break;
      case "Exponentiate":
      case "FixedEffect":
      case "Leave1Out":
      case "TrimAndFill":
      case "ForestPlot":
      case "FunnelPlot":
      case "DiagnosticPlot":
        AnalysisSettingObj[target] = !AnalysisSettingObj[target]
        break;
      default:
        break;
    }
    this.setState({AnalysisSetting: {...AnalysisSettingObj}})
  }

  render () {
    return (
      <div className="mt-2">        
        <ExpansionPanel square expanded={this.state.panels.variableSelection}
        onChange = {this.handlePanelExpansion("variableSelection")}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>Meta-Analysis/ Meta-Regression</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
            <MAVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
            <Typography>Model builder - Add interaction terms</Typography>
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
            <MAAnalysisSetting 
            Variables = {this.state.Variables}
            AnalysisSetting = {this.state.AnalysisSetting}
            updateAnalysisSettingCallback = {this.updateAnalysisSetting}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>    
      </div>
    )
  }
}