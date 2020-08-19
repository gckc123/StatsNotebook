import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CorrelogramVariableSelection } from './CorrelogramVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { CorrelogramDataVizSetting } from "./CorrelogramDataVizSetting";
import { LabelAndThemeDataVizSetting } from "./LabelAndThemeDataVizSetting";
import { Alert } from './Alert.js'

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


export class CorrelogramPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            Horizontal: [],
            FillColor: [],
            
        }, 
        TreatmentLvs : [], 
        Checked: {
            Available: [],
            Horizontal: [],
            FillColor: [],
        
        },
        hideToRight: {
            Horizontal: false,
            FillColor: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: true,
          analysisSetting: false,
          labelAndThemeSetting: false,
        },
        AnalysisSetting: {          

          title: "",
          titleFontSize: "",
          xlab: "",
          xlabFontSize: "",
          xLowerLim: "",
          xUppperLim: "",
          xAxisFontSize: "",
          ylab: "",
          yLowerLim: "",
          yUpperLim: "",
          ylabFontSize: "",
          yAxisFontSize: "",
          legendFillLab: "",
          legendColorLab: "",
          legendShapeLab: "",
          legendSizeLab: "",
          legendFontSize: "",
          legendKeyFontSize: "",
          legendPosition: "bottom",
          facetFontSize: "",
          theme: "theme_bw",
          colorPalette: "Set2"
          
        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveDataVizPanel === "CorrelogramPanel") {
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

          let addToAvailable = this.not(CurrentVariableList, allVarsInCurrentList)
          VariablesObj["Available"] = VariablesObj["Available"].concat(addToAvailable)

          VariablesObj["Available"].sort()

          this.setState({Variables:{...VariablesObj}})
          this.setState({Checked: {...CheckedObj}})
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
    let toRightVars = []
    

    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
      
      if (target === "Horizontal") {
        toRightVars = CheckedObj["Available"].filter((item) =>
          this.props.CurrentVariableList[item][0] !== "Character"
        )

        if (toRightVars.length !== CheckedObj["Available"].length) {
          this.setState({showAlert: true, 
            alertText: "Character variables will not be added. These variables need to be firstly converted into factor variables.",
            alertTitle: "Alert"
          })
        }

      }else if (target === "FillColor") {
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
      let VariablesObj = {...this.state.Variables}
      let CheckedObj = {...this.state.Checked}
      VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
      VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])

      if (from === "Treatment1" || from === "Treatment2") {    
        this.setState({TreatmentLvs: [...this.getTreatmentLv(VariablesObj)]}, () => console.log(this.state.TreatmentLvs))       
      }

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
    let codeString = (this.state.AnalysisSetting.theme === "theme_ipsum" ? "library(hrbrthemes)\n\n" : "")

    let dropNA = this.state.Variables.Horizontal.concat(this.state.Variables.FillColor)
    

      codeString = codeString + "library(GGally)\n\ncurrentDataset %>%\n" 

      if (this.props.imputedDataset) {
        if (this.state.AnalysisSetting.originalData) {
          codeString = codeString + "  filter(.imp == 0) %>%\n"
          codeString = codeString + (dropNA.length > 0 ? "  drop_na("+ dropNA.join(", ") + ") %>%\n" : "")
        }else{
          codeString = codeString + "  filter(.imp == 1) %>%\n"
        }
      }else{
        codeString = codeString + (dropNA.length > 0 ? "  drop_na("+ dropNA.join(", ") + ") %>%\n" : "")
      }
      
      codeString = codeString + "  select(" + (this.state.Variables.Horizontal.concat(this.state.Variables.FillColor)).join(", ") + ") %>%\n"

      codeString = codeString + "  ggpairs(progress = FALSE"+ (this.state.Variables.FillColor.length > 0 ? ",\n  ggplot2::aes(alpha = 0.65, color = " + this.state.Variables.FillColor[0] + ")" :"") + ")" +
      (this.state.AnalysisSetting.colorPalette === "ggplot_default" ? "" : "+\n    scale_fill_brewer(palette = \"" + 
      this.state.AnalysisSetting.colorPalette + "\")") + 
      (this.state.AnalysisSetting.colorPalette === "ggplot_default" ? "" : "+\n    scale_color_brewer(palette = \"" + 
      this.state.AnalysisSetting.colorPalette + "\")") + 
      (this.state.AnalysisSetting.theme === "ggplot_default" ? "" : "+\n    " + this.state.AnalysisSetting.theme + "(base_family = \"sans\")") + 
      (this.state.AnalysisSetting.title === "" ? "" : "+\n    ggtitle(\"" + this.state.AnalysisSetting.title + "\")") +
      (this.state.AnalysisSetting.xlab === "" ? "" : "+\n    xlab(\"" + this.state.AnalysisSetting.xlab + "\")") +
      (this.state.AnalysisSetting.ylab === "" ? "" : "+\n    ylab(\"" + this.state.AnalysisSetting.ylab + "\")") +
      
      (this.state.AnalysisSetting.titleFontSize === "" ? "" : "+\n    theme(plot.title = element_text(size = " + 
      this.state.AnalysisSetting.titleFontSize + "))") +
      (this.state.AnalysisSetting.xlabFontSize === "" ? "" : "+\n    theme(axis.title.x = element_text(size = " + 
      this.state.AnalysisSetting.xlabFontSize + "))") +
      (this.state.AnalysisSetting.ylabFontSize === "" ? "" : "+\n    theme(axis.title.y = element_text(size = " + 
      this.state.AnalysisSetting.ylabFontSize + "))") +
      (this.state.AnalysisSetting.xAxisFontSize === "" ? "" : "+\n    theme(axis.text.x = element_text(size = " + 
      this.state.AnalysisSetting.xAxisFontSize + "))") +
      (this.state.AnalysisSetting.yAxisFontSize === "" ? "" : "+\n    theme(axis.text.y = element_text(size = " + 
      this.state.AnalysisSetting.yAxisFontSize + "))") +

      "\n\n"
      
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
      case "BinWidth":
      case "title":
      case "titleFontSize":
      case "xlab":
      case "xlabFontSize":
      case "xAxisFontSize":
      case "ylab":
      case "ylabFontSize":
      case "yAxisFontSize":
      case "legendFillLab":
      case "legendColorLab":
      case "legendShapeLab":
      case "legendSizeLab":
      case "legendFontSize":
      case "legendPosition":
      case "facetFontSize":
      case "theme":
      case "colorPalette":
      case "xLowerLim":
      case "xUpperLim":
      case "yLowerLim":
      case "yUpperLim":
        AnalysisSettingObj[target] = event.target.value
        break;
      case "Density":
      case "Polygon":
      case "SetBinWidth":
      case "originalData":
        AnalysisSettingObj[target] = !AnalysisSettingObj[target]
        break;
      default:
        break;
    }
    console.log(this.props.imputedDataset)
    this.setState({AnalysisSetting: {...AnalysisSettingObj}})
  }

  updateLabelAndThemeSetting = (updatedLabelAndThemeSetting) => {
    let AnalysisSettingObj = {...this.state.AnalysisSetting, ...updatedLabelAndThemeSetting}
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
      {this.props.currentActiveDataVizPanel === "CorrelogramPanel" &&
        <div>
          <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
          title = {this.state.alertTitle}
          content = {this.state.alertText}></Alert>            
          <ExpansionPanel square expanded={this.state.panels.variableSelection}
          onChange = {this.handlePanelExpansion("variableSelection")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Correlogram</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <CorrelogramVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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

          <ExpansionPanel square expanded={this.state.panels.analysisSetting}
          onChange = {this.handlePanelExpansion("analysisSetting")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Correlogram Setting</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <CorrelogramDataVizSetting 
              Variables = {this.state.Variables}
              CategoricalVarLevels = {this.props.CategoricalVarLevels}
              AnalysisSetting = {this.state.AnalysisSetting}
              updateAnalysisSettingCallback = {this.updateAnalysisSetting}
              imputedDataset = {this.props.imputedDataset}/>
            </ExpansionPanelDetails>
          </ExpansionPanel> 

          <ExpansionPanel square expanded={this.state.panels.labelAndThemeSetting}
          onChange = {this.handlePanelExpansion("labelAndThemeSetting")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Label and Theme</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <LabelAndThemeDataVizSetting 
              Variables = {this.state.Variables}
              CategoricalVarLevels = {this.props.CategoricalVarLevels}
              AnalysisSetting = {this.state.AnalysisSetting}
              updateAnalysisSettingCallback = {this.updateAnalysisSetting}
              updateLabelAndThemeSettingCallback = {this.updateLabelAndThemeSetting}
              needFillLabel = {this.state.Variables.FillColor.length > 0}
              needColorLabel = {false}
              needShapeLabel = {false}
              needSizeLabel = {false}
              needYLim = {false}
              needXLim = {false}
              needFacetFontSize = {false}

              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      }
      </div>
    )
  }
}