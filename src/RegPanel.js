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
          RobustReg: false,
          ImputedDataset: false,
          
        }
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "LRPanel") {
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
      }

      CheckedObj["Available"] = []
      this.setState({Variables: {...VariablesObj}, RandomSlopes: {...RandomSlopesObj}, CheckedRandomSlopes: {...CheckedRandomSlopesObj}},
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

    codeString = codeString + "\n" + formulaCode + "\n" + methodCode + "\ncurrentDataset <- complete(mice(currentDataset,\n  method = meth,\n  formulas = formulas,\n  m = "+ 
    this.state.AnalysisSetting.M + "), action = \"long\")"

    

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
      case "M":
        AnalysisSettingObj[target] = event.target.value
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
            <Typography>Regression - Variable Selection</Typography>
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
        onChange = {this.handlePanelExpansion("randomEffect")}>
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
            updateAnalysisSettingCallback = {this.updateAnalysisSetting}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>    
      </div>
    )
  }
}