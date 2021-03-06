import React, { Component } from 'react';
import "./App.css";
import "./AnalysisPanelElements.css";
import { Alert } from './Alert.js';
import _ from "lodash";
import { AnalysisPanelBar } from "./AnalysisPanelBar";
import { ReshapeVariableSelection } from './ReshapeVariableSelection';
import "./DataPanelElements.css"; 
import "./AnalysisPanelElements.css";
import "./Notebook.css";


export class ReshapePanel extends Component {

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
        tentativeScript: "",
        hideToRight: {
            Covariates: false,
        },
        AnalysisSetting: {
          operation: "",
          newVariable: "",
          w2lBaseOn: "",
        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveDataPanel === "ReshapePanel") {
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
      this.setState({Variables: {...VariablesObj}, Checked: {...CheckedObj}},
        () => this.buildCode())  

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
      this.setState({Variables: {...VariablesObj}, Checked: {...CheckedObj}},
          () => this.buildCode())
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

    if (this.state.AnalysisSetting["operation"] === "w2l") {
      codeString = codeString + "currentDataset <- currentDataset %>% pivot_longer(c(\""+ this.state.Variables["Covariates"].join("\", \"") +"\"),"+
      "\n  names_to = c(\".value\", \""+ this.state.AnalysisSetting.newVariable +"\"),\n  names_pattern = \"(.*)_(.*)\")"
    }else 
    {
      codeString = codeString + "currentDataset <- currentDataset %>% pivot_wider(names_from = "+ this.state.AnalysisSetting.w2lBaseOn +",\n" + 
      "  names_glue = \"{.value}_{"+ this.state.AnalysisSetting.w2lBaseOn +"}\",\n  values_from = c(\""+ this.state.Variables["Covariates"].join("\", \"") +"\"))"
    }

    codeString = codeString + "\n\n\"Chan, G. and StatsNotebook Team (2020). StatsNotebook. (Version "+ this.props.currentVersion +") [Computer Software]. Retrieved from https://www.statsnotebook.io\"\n"+
      "\"R Core Team (2020). The R Project for Statistical Computing. [Computer software]. Retrieved from https://r-project.org\"\n"

    this.setState({tentativeScript: codeString})
  }

  handlePanelExpansion = (target) => (event, newExpanded) => {
    let panelsObj = {...this.state.panels}
    panelsObj[target] = !panelsObj[target]
    this.setState({panels: panelsObj})
  }

  updateAnalysisSetting = (event,target) => {
    let AnalysisSettingObj = {...this.state.AnalysisSetting}
    
    switch (target) {
      case "operation":
      case "newVariable":
      case "w2lBaseOn":
        AnalysisSettingObj[target] = event.target.value
        break;
      default:
        break;
    }
    this.setState({AnalysisSetting: {...AnalysisSettingObj}}, ()=> this.buildCode())
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
      <div className="compute-pane">
        <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
          title = {this.state.alertTitle}
          content = {this.state.alertText}></Alert>  
        <div className="notebook-bar">
                  <AnalysisPanelBar addExtraBlkCallback = {this.props.addExtraBlkCallback}
                  runScriptCallback = {this.props.runScriptCallback}
                  tentativeScript = {this.state.tentativeScript}
                  currentActiveLeftPanel = ""
                  currentActiveDataVizPanel = ""
                  currentActiveAnalysisPanel = ""/>
        </div>
        
        <div className="compute-pane-target-var-box pt-2">
              <div className = "InvisibleBottomBorder pl-2">Operation</div>
              <div>
                  <select value = {this.state.AnalysisSetting.operation}
                      onChange={(event) => this.updateAnalysisSetting(event, "operation")}
                      className="ReshapeSelection">
                      <option value="">--- Select operation ---</option>
                      <option value="w2l">Wide to Long</option>
                      <option value="l2w">Long to Wide</option>
                  </select>
              </div>
        </div>

        <div className="compute-pane-target-var-box pt-2" hidden={this.state.AnalysisSetting["operation"] !== "w2l"}>
              <div className = "InvisibleBottomBorder pl-2">New Variable</div>
              <div>
                  <input value={this.state.AnalysisSetting["newVariable"]}
                  className="ReshapeInput"
                  onChange={(event) => this.updateAnalysisSetting(event, "newVariable")}></input>
              </div>
        </div>

        <div className="compute-pane-target-var-box pt-2"  hidden={this.state.AnalysisSetting["operation"] !== "l2w"}>
              <div className = "InvisibleBottomBorder pl-2">Base on</div>
              <div>
                  <select value = {this.state.AnalysisSetting.w2lBaseOn}
                  onChange={(event) => this.updateAnalysisSetting(event, "w2lBaseOn")}
                  className="ReshapeSelection">
                    <option value="">--- Select variable ---</option>
                    {
                      this.state.Variables.Available.map((item, index) => {
                        return (
                          <option value={item} key={item}>{item}</option>
                        )
                      })
                    }
                  </select>
              </div>
        </div>

        <div className="pl-2 pr-2 pt-2">
          <ReshapeVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
        </div>

      </div>
    )
  }
}