import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ScatterplotVariableSelection } from './ScatterplotVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { ScatterplotDataVizSetting } from "./ScatterplotDataVizSetting";
import { LabelAndThemeDataVizSetting } from "./LabelAndThemeDataVizSetting";
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


export class ScatterplotPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            Horizontal: [],
            Vertical: [],
            FillColor: [],
            Shape: [],
            Size: [],
            Facet: [],
            Frame: [],
            
        }, 

        Checked: {
            Available: [],
            Horizontal: [],
            Vertical: [],
            FillColor: [],
            Shape: [],
            Size: [],
            Facet: [],
            Frame: [],          
        },
        hideToRight: {
            Horizontal: false,
            Vertical: false,
            FillColor: false,
            Shape: false,
            Size: false,
            Facet: false,
            Frame: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: true,
          analysisSetting: false,
          labelAndThemeSetting: false,
        },
        AnalysisSetting: {          
          fittedLine: false,
          fittedLineType: "lm",
          confInt: false,
          confIntLevel: "95",
          byShape: false,
          byFillColor: false,
          marginalPlot: false,
          marginalPlotType: "histogram",
          rug: false,
          jitter: true,
          scale_x_log10: false,
          scale_y_log10: false,
          ani_width: 500,
          ani_height: 500,
          ani_file: "animated_scatterplot",

          originalData: true,
          title: "",
          titleFontSize: "",
          xlab: "",
          xlabFontSize: "",
          xLowerLim: "",
          xUpperLim: "",
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
          colorPalette: "ggplot_default"
          
        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
        sortAvailable: false,
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveDataVizPanel === "ScatterplotPanel" && !this.props.setPanelFromNotebook) {
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
    }else if((this.props.currentActiveDataVizPanel === "ScatterplotPanel" && this.props.setPanelFromNotebook)) {
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
    })

  }

  handleToRight = (target, maxElement) => {
    let VariablesObj = _.cloneDeep(this.state.Variables)
    let CheckedObj = _.cloneDeep(this.state.Checked)
    let toRightVars = []
    

    if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
      
      if (target === "Vertical" || (target === "Horizontal")) {
        toRightVars = CheckedObj["Available"].filter((item) =>
          this.props.CurrentVariableList[item][0] !== "Character"
        )

        if (toRightVars.length !== CheckedObj["Available"].length) {
          this.setState({showAlert: true, 
            alertText: "Character variables will not be added. Only numeric variables can be added.",
            alertTitle: "Alert"
          })
        }

      }else if ((target === "FillColor") || (target === "Facet" || (target === "Shape") || (target === "Size") || (target === "Frame"))) {
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
    let codeString = (this.state.AnalysisSetting.theme === "theme_ipsum" ? "library(hrbrthemes)\n\n" : "")
    codeString = codeString + (this.state.AnalysisSetting.marginalPlot ? "library(ggMarginal)\n\n": "")

    let dropNA = this.state.Variables.FillColor.concat(this.state.Variables.Facet).concat(this.state.Variables.Shape).concat(this.state.Variables.Size)
    
    let vertical = this.state.Variables.Vertical[0]
    let horizontal = this.state.Variables.Horizontal[0]


      codeString = codeString + "plot <- currentDataset %>%\n" 

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
      
      codeString = codeString + 
      "  ggplot(aes(y = " + vertical + ", x = " + horizontal + 
      ((this.state.AnalysisSetting.byFillColor && this.state.Variables.FillColor.length > 0) ? ", color = " + this.state.Variables.FillColor[0] : "") +
      ((this.state.AnalysisSetting.byShape && this.state.Variables.Shape.length > 0) ? ", shape = " + this.state.Variables.Shape[0] : "") + 
      (this.state.Variables.Size.length > 0 ? ", size = " + this.state.Variables.Size[0] : "") + ")) +\n" +
      (this.state.AnalysisSetting.jitter ? "    geom_jitter" : "    geom_point") + 
      "(alpha = " + (this.state.Variables.Size.length > 0 ? "0.5" : "0.8")
      + ((!this.state.AnalysisSetting.byFillColor && this.state.Variables.FillColor.length > 0) ? ", aes(color = " + 
      this.state.Variables.FillColor[0] + 
      ((!this.state.AnalysisSetting.byShape && this.state.Variables.Shape.length > 0)? ", shape = " + this.state.Variables.Shape[0] : "") + ")": "") + 
      ((!this.state.AnalysisSetting.byShape && this.state.Variables.Shape.length > 0) && this.state.Variables.FillColor.length === 0 ? ", aes(shape =" +
      this.state.Variables.Shape[0] + ")" : "") + 
      ", na.rm = TRUE)" +
      (this.state.AnalysisSetting.fittedLine ? "+\n    geom_smooth(method = \"" + this.state.AnalysisSetting.fittedLineType + "\"" + 
      (this.state.AnalysisSetting.confInt ? ", se = TRUE, level = " + this.state.AnalysisSetting.confIntLevel/100 : ", se = FALSE") + ", na.rm = TRUE, show.legend = FALSE)": "") + 
      (this.state.AnalysisSetting.rug ? "+\n    geom_rug(col = \"steelblue\", alpha = 0.1, size = 1)" : "") + 
      (this.state.Variables.Size.length > 0 ? "+\n    scale_size(range = c(0.1, 8))" :"") +
      (this.state.AnalysisSetting.scale_x_log10 ? "+\n    scale_x_log10()": "")+
      (this.state.AnalysisSetting.scale_y_log10 ? "+\n    scale_y_log10()": "")+
      (this.state.AnalysisSetting.colorPalette === "ggplot_default" ? "" : "+\n    scale_fill_brewer(palette = \"" + 
      this.state.AnalysisSetting.colorPalette + "\")+\n    scale_color_brewer(palette = \""+ this.state.AnalysisSetting.colorPalette +"\")") + 
      (this.state.Variables.Facet.length > 0? "+\n    facet_wrap( ~ " + this.state.Variables.Facet[0] + ")": "") +
      (this.state.AnalysisSetting.theme === "ggplot_default" ? "" : "+\n    " + this.state.AnalysisSetting.theme + "(base_family = \"sans\")") + 
      (this.state.AnalysisSetting.title === "" ? "" : "+\n    ggtitle(\"" + this.state.AnalysisSetting.title + "\")") +
      (this.state.AnalysisSetting.xlab === "" ? "" : "+\n    xlab(\"" + this.state.AnalysisSetting.xlab + "\")") +
      (this.state.AnalysisSetting.ylab === "" ? "" : "+\n    ylab(\"" + this.state.AnalysisSetting.ylab + "\")") +
      ((this.state.AnalysisSetting.xLowerLim === "" | this.state.AnalysisSetting.xUpperLim === "") ? "" : "+\n    xlim("+this.state.AnalysisSetting.xLowerLim +", " + this.state.AnalysisSetting.xUpperLim +")") +
      ((this.state.AnalysisSetting.yLowerLim === "" | this.state.AnalysisSetting.yUpperLim === "") ? "" : "+\n    ylim("+this.state.AnalysisSetting.yLowerLim +", " + this.state.AnalysisSetting.yUpperLim +")") +
      (this.state.AnalysisSetting.legendFillLab === "" ? "" : "+\n    labs(color = \"" + this.state.AnalysisSetting.legendFillLab + "\", fill = \""+ 
      this.state.AnalysisSetting.legendFillLab +"\")") +
      (this.state.AnalysisSetting.legendShapeLab === "" ? "" : "+\n    labs(shape = \"" + this.state.AnalysisSetting.legendShapeLab + "\")") +
      (this.state.AnalysisSetting.legendSizeLab === "" ? "" : "+\n    labs(size = \"" + this.state.AnalysisSetting.legendSizeLab + "\")") +
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
      (this.state.AnalysisSetting.legendFontSize === "" ? "" : "+\n    theme(legend.title = element_text(size = " + 
      this.state.AnalysisSetting.legendFontSize + "))") +
      (this.state.AnalysisSetting.legendKeyFontSize === "" ? "" : "+\n    theme(legend.text = element_text(size = " + 
      this.state.AnalysisSetting.legendKeyFontSize + "))") +
      (this.state.AnalysisSetting.facetFontSize === "" ? "" : "+\n    theme(strip.text.x = element_text(size = " + 
      this.state.AnalysisSetting.facetFontSize + "))") +
      (this.state.AnalysisSetting.legendPosition === "right" ? "" : "+\n    theme(legend.position = \"" + this.state.AnalysisSetting.legendPosition +"\")") +
      (this.state.AnalysisSetting.marginalPlot? "%>%\n    ggMarginal(type=\""+ this.state.AnalysisSetting.marginalPlotType +"\")": "") +
      "\nplot" +
      (this.state.Variables.Frame.length > 0 ? "\n\nlibrary(gganimate)\nlibrary(gifski)\n\nanimated_plot <- plot + " + 
        (this.props.CurrentVariableList[this.state.Variables.Frame[0]][0] === "Numeric" ? "transition_time(" + this.state.Variables.Frame[0] + ")": "transition_states("+
        this.state.Variables.Frame[0] +", transition_length = 1, state_length = 2)") + 
          "+\n    labs(subtitle = \""+ this.state.Variables.Frame[0] + ":"+ 
          (this.props.CurrentVariableList[this.state.Variables.Frame[0]][0] === "Numeric" ? " {frame_time}": " {closest_state}") + "\")" + 
          "\nanimate(animated_plot, width = " + this.state.AnalysisSetting.ani_width + ", height = " + this.state.AnalysisSetting.ani_height + ", renderer = gifski_renderer())" + 
          "\nanim_save(\"" + this.state.AnalysisSetting.ani_file + ".gif\", animation = last_animation())" +
          "\npaste(\"Animated plot saved at \", getwd()) " : "") +
      "\n"

    
    

    

    
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
      case "fittedLineType":
      case "confIntLevel":
      case "marginalPlotType":
      case "ani_width":
      case "ani_height":
      case "ani_file":
        AnalysisSettingObj[target] = event.target.value
        break;
      case "fittedLine":
      case "confInt":
      case "byShape":
      case "byFillColor":
      case "marginalPlot":
      case "rug":
      case "originalData":
      case "jitter":
      case "scale_x_log10":
      case "scale_y_log10":
        AnalysisSettingObj[target] = !AnalysisSettingObj[target]
        break;
      default:
        break;
    }
    this.setState({AnalysisSetting: {...AnalysisSettingObj}})
  }

  updateLabelAndThemeSetting = (updatedLabelAndThemeSetting) => {
    let AnalysisSettingObj = {...this.state.AnalysisSetting, ...updatedLabelAndThemeSetting}
    this.setState({AnalysisSetting: {...AnalysisSettingObj}}, () => console.log(this.state.AnalysisSetting))
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
      {this.props.currentActiveDataVizPanel === "ScatterplotPanel" &&
        <div>
          <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
          title = {this.state.alertTitle}
          content = {this.state.alertText}></Alert>            
          <ExpansionPanel square expanded={this.state.panels.variableSelection}
          onChange = {this.handlePanelExpansion("variableSelection")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Scatterplot</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <ScatterplotVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
              <Typography>Scatterplot Setting</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <ScatterplotDataVizSetting 
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
              <Typography>Label, Theme and Settings</Typography>
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
              needShapeLabel = {this.state.Variables.Shape.length > 0}
              needSizeLabel = {this.state.Variables.Size.length > 0}
              needYLim = {true}
              needXLim = {true}
              needFacetFontSize = {this.state.Variables.Facet.length > 0}

              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      }
      </div>
    )
  }
}