import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MatchingVariableSelection } from './MatchingVariableSelection';
import "./App.css";
import "./AnalysisPanelElements.css";
import { MatchingAnalysisSetting } from "./MatchingAnalysisSetting";
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


export class MatchingPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
        Variables: {
            Available: [],
            Outcome: [],
            Exposure: [],
            Covariates: [],
        }, 
        Checked: {
            Available: [],
            Outcome: [],
            Exposure: [],
            Covariates: [],
        },

        hideToRight: {
            Outcome: false,
            Exposure: false,
            Covariates: false,
        },
        tentativeScript: "",
        panels: {
          variableSelection: true,
          modelSpec: false,
          analysisSetting: false,
        },
        AnalysisSetting: {
          confLv: 95,
          Plot: true,
          Ratio: 1,
          Method: 'nearest',
          Distance: 'glm',
          Replacement: false,
          EstOutcome: false,
          OutcomeModel: 'lm',
          Link: 'identify',
          DoubleRobust: false,
          ImputedDataset: false,
          ImputeMissing: false,
          Boot: false,
        },
        showAlert: false,
        alertText: "",
        alertTitle: "",
        sortAvailable: false,
    }
  }

  componentDidUpdate() {
    //Update variable list
    if (this.props.currentActiveAnalysisPanel === "MatchingPanel" && !this.props.setPanelFromNotebook) {
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
    }else if((this.props.currentActiveAnalysisPanel === "MatchingPanel" && this.props.setPanelFromNotebook)) {
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
        VariablesObj["Available"] = this.not(VariablesObj["Available"],CheckedObj["Available"])
        VariablesObj[target] = VariablesObj[target].concat(CheckedObj["Available"])
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

    let codeString = "library(MatchIt)\nlibrary(lmtest)\nlibrary(sandwich)\n\n"
    
    try {
      
      if (this.state.AnalysisSetting.ImputedDataset) {
        codeString = codeString + "library(mice)\n" +  
        ((this.state.AnalysisSetting.Boot && !this.state.AnalysisSetting.Replacement) ? "library(doParallel)\nlibrary(foreach)\n\ncl <- makeCluster(detectCores()-1)\nregisterDoParallel(cl)\nboot_res <- NULL\nboot_n <- 5000\n": "") +
        "match_obj <- NULL\nres <- NULL\ncovar <- NULL\nb <- data.frame()\nm <- max(currentDataset$.imp)\ncoeftest_obj <- NULL\nmatched_data <- NULL\n\n" +
        "for (i in (1:m)) {" +
        "\n  match_obj[[i]] <- matchit(" + this.state.Variables.Exposure[0] + " ~ " + this.state.Variables.Covariates.join(" + ") + 
        ",\n    data = currentDataset[currentDataset$.imp == i,], method = \""+ this.state.AnalysisSetting.Method +"\", distance =\"" + this.state.AnalysisSetting.Distance + "\"" + 
        ",\n    ratio = " + this.state.AnalysisSetting.Ratio +
        (this.state.AnalysisSetting.Method == "full" ? ",\n    estimand = \"ATE\"" : (this.state.AnalysisSetting.Method != "optimal" ? ",\n    replace = " + (this.state.AnalysisSetting.Replacement ? "TRUE" : "FALSE"): "") ) +")" +
        "\n  if (i<=3) {" +
        "\n    print(summary(match_obj[[i]]))\n"

        if (this.state.AnalysisSetting.Plot) {
          codeString = codeString + "    plot(match_obj[[i]], type = \"jitter\", interactive = FALSE)\n" +
          "    plot(summary(match_obj[[i]]), abs = FALSE)"
        }
        
        codeString = codeString + "\n  }\n\n" 
        
        if (this.state.AnalysisSetting.EstOutcome) {
          codeString = codeString + "  matched_data[[i]] <- " + (this.state.AnalysisSetting.Replacement && this.state.AnalysisSetting.Method != "full" && this.state.AnalysisSetting.Method != "optimal" ? "get_matches" : "match.data") + "(match_obj[[i]])\n"
          if (this.state.AnalysisSetting.OutcomeModel == "lm") {
            codeString = codeString + "  res[[i]] <- lm("+ this.state.Variables.Outcome[0] + " ~ " + 
            this.state.Variables.Exposure[0]+
            (this.state.AnalysisSetting.DoubleRobust ? " + " + this.state.Variables.Covariates.join(" + ") : "") + ", data = " +
            "  matched_data[[i]], weights = weights)\n" +
            "  b <- rbind(b, res[[i]]$coefficients)\n" +
            "  covar[[i]] <- vcovCL(res[[i]], cluster = ~subclass" + (this.state.AnalysisSetting.Replacement && this.state.AnalysisSetting.Method != "full" && this.state.AnalysisSetting.Method != "optimal" ? "+ id" : "") + ")"

            if (this.state.AnalysisSetting.Boot && !this.state.AnalysisSetting.Replacement) {
              codeString = codeString + "\n\n  pair_ids <- levels(matched_data[[i]]$subclass)\n" +
              "  boot_res[[i]] <- foreach (k = (1:boot_n), .combine = \'rbind\') %dopar% {\n" +
              "    boot_sample_ids <- sample(pair_ids, replace = TRUE)\n" +
              "    num_present_in_boot_sample <- table(boot_sample_ids)\n" +
              "    ids <- unlist(lapply(pair_ids[pair_ids %in% names(num_present_in_boot_sample)],\n" +
              "        function(p) rep(which(matched_data[[i]]$subclass == p),\n" +
              "        num_present_in_boot_sample[p])))\n\n" +
              "    boot_data <- matched_data[[i]][ids, ]\n" +
              "    boot_fit <- lm("+ this.state.Variables.Outcome[0] + " ~ " + 
              this.state.Variables.Exposure[0]+
              (this.state.AnalysisSetting.DoubleRobust ? " + " + this.state.Variables.Covariates.join(" + ") : "") + ", data = " +
              "boot_data, weights = weights)\n" +
              "    boot_fit$coefficients\n" +
              "  }\n" +
              "  boot_res[[i]] <- data.frame(boot_res[[i]])\n" 
            }

          }else if (this.state.AnalysisSetting.OutcomeModel == "glm") {
            codeString = codeString + "  res[[i]] <- glm(" + this.state.Variables.Outcome[0] + " ~ " + 
            this.state.Variables.Exposure[0] + ", data = " +
            "(matched_data[[i]]), weights = weights, " +
            "\n    family = "+ (this.state.AnalysisSetting.Link == "logit" ? "quasibinomial(link = \"logit\")" : (this.state.AnalysisSetting.Link == "log" ? "quasipoisson(link = \"log\")": "gaussian(link = \"identity\")") ) + ")\n" +
            "  b <- rbind(b, res[[i]]$coefficients)\n" +
            "  covar[[i]] <- vcovCL(res[[i]], cluster = ~subclass" + (this.state.AnalysisSetting.Replacement && this.state.AnalysisSetting.Method != "full" && this.state.AnalysisSetting.Method != "optimal" ? "+ id" : "") + ")"

            if (this.state.AnalysisSetting.Boot && !this.state.AnalysisSetting.Replacement) {
              codeString = codeString + "\n\n  pair_ids <- levels(matched_data[[i]]$subclass)\n" +
              "  boot_res[[i]] <- foreach (k = (1:boot_n), .combine = \'rbind\') %dopar% {\n" +
              "    boot_sample_ids <- sample(pair_ids, replace = TRUE)\n" +
              "    num_present_in_boot_sample <- table(boot_sample_ids)\n" +
              "    ids <- unlist(lapply(pair_ids[pair_ids %in% names(num_present_in_boot_sample)],\n" +
              "        function(p) rep(which(matched_data[[i]]$subclass == p),\n" +
              "        num_present_in_boot_sample[p])))\n\n" +
              "    boot_data <- matched_data[[i]][ids, ]\n" +
              "    boot_fit <- glm(" + this.state.Variables.Outcome[0] + " ~ " + 
              this.state.Variables.Exposure[0] + ", data = " +
              "(matched_data[[i]]), weights = weights, " +
              "\n      family = "+ (this.state.AnalysisSetting.Link == "logit" ? "quasibinomial(link = \"logit\")" : (this.state.AnalysisSetting.Link == "log" ? "quasipoisson(link = \"log\")": "gaussian(link = \"identity\")") ) + ")\n" +
              "    boot_fit$coefficients\n" +
              "  }\n" +
              "  boot_res[[i]] <- data.frame(boot_res[[i]])\n" 
            }
          }
        }

        codeString = codeString + "\n}\n"

        if (this.state.AnalysisSetting.EstOutcome) {
          codeString = codeString +
          "\ncolnames(b) <- attributes(res[[1]]$coefficients)$names" + 
          "\nU_bar <- Reduce(\"+\", covar)/m" + 
          "\nU_bar <- diag(U_bar)" + 
          "\nB <- sapply(b, var)" + 
          "\nT <- U_bar + (1 + 1/m)*B" +
          "\nSE <- T^0.5" +
          "\n\nest <- data.frame(var = names(b))" + 
          "\nest$b <- sapply(b, mean)" +
          "\nest$SE <- SE" +
          "\nest$Z <- est$b/est$SE" +
          "\nest$p_value <- pnorm(abs(est$Z), lower.tail = FALSE)*2" +
          "\n\"Tests using cluster-robust standard error\"" +
          "\n\nprint(est)"
          if (this.state.AnalysisSetting.Boot && !this.state.AnalysisSetting.Replacement) {
            codeString = codeString + "\n\"Bootstrapped convidence interval\"\n" +
            "boot_res_combined <- bind_rows(boot_res, .id = NULL)\n" +
            "sapply(boot_res_combined, quantile, c("+ ((1 - this.state.AnalysisSetting.confLv/100)/2).toFixed(3) +", " + (1-(1 - this.state.AnalysisSetting.confLv/100)/2).toFixed(3) + "))"
          }
        }

      }else{
        codeString = codeString + "match_obj <- matchit(" + this.state.Variables.Exposure[0] + " ~ " + this.state.Variables.Covariates.join(" + ") + 
        ",\n  data = currentDataset, method = \""+ this.state.AnalysisSetting.Method +"\", distance =\"" + this.state.AnalysisSetting.Distance + "\"" + 
        ",\n  ratio = " + this.state.AnalysisSetting.Ratio +
        (this.state.AnalysisSetting.Method == "full" ? ",\n  estimand = \"ATE\"" : (this.state.AnalysisSetting.Method != "optimal" ? ",\n  replace = " + (this.state.AnalysisSetting.Replacement ? "TRUE" : "FALSE"): "") ) +
        ")\nsummary(match_obj)\n\n"
        
        if (this.state.AnalysisSetting.Plot) {
          codeString = codeString + "plot(match_obj, type = \"jitter\", interactive = FALSE)\n" +
          "plot(summary(match_obj), abs = FALSE)\n\n"
        }

        if (this.state.AnalysisSetting.EstOutcome) {
          codeString = codeString + "matched_data <- " + (this.state.AnalysisSetting.Replacement && this.state.AnalysisSetting.Method != "full" && this.state.AnalysisSetting.Method != "optimal" ? "get_matches" : "match.data") + "(match_obj)\n"
          if (this.state.AnalysisSetting.OutcomeModel == "lm") {
            codeString = codeString + "res <- lm("+ this.state.Variables.Outcome[0] + " ~ " + 
            this.state.Variables.Exposure[0]+
            (this.state.AnalysisSetting.DoubleRobust ? " + " + this.state.Variables.Covariates.join(" + ") : "") + ", data = " +
            "matched_data, weights = weights)\n" +
            "coeftest(res, vcov. = vcovCL, cluster = ~subclass" + (this.state.AnalysisSetting.Replacement && this.state.AnalysisSetting.Method != "full" && this.state.AnalysisSetting.Method != "optimal" ? "+ id" : "") + ")\n" + 
            "coefci(res, vcov. = vcovCL, cluster = ~subclass" + (this.state.AnalysisSetting.Replacement && this.state.AnalysisSetting.Method != "full" && this.state.AnalysisSetting.Method != "optimal" ? "+ id" : "") + ", level = "
            + this.state.AnalysisSetting.confLv/100 + ")\n"

            if (this.state.AnalysisSetting.Boot && !this.state.AnalysisSetting.Replacement) {
              codeString = codeString + "\n\nlibrary(doParallel)\nlibrary(foreach)\n\ncl <- makeCluster(detectCores()-1)\nregisterDoParallel(cl)\nboot_res <- NULL\nboot_n <- 5000\n" +
              "pair_ids <- levels(matched_data$subclass)\n\n" +
              "boot_res <- foreach(k = (1:boot_n), .combine = \'rbind\') %dopar% {\n" +
              "  boot_sample_ids <- sample(pair_ids, replace = TRUE)\n" +
              "  num_present_in_boot_sample <- table(boot_sample_ids)\n" +
              "  ids <- unlist(lapply(pair_ids[pair_ids %in% names(num_present_in_boot_sample)],\n" +
              "    function(p) rep(which(matched_data$subclass == p),\n" +
              "    num_present_in_boot_sample[p])))\n" +
              "  boot_data <- matched_data[ids, ]\n" +
              "  boot_fit <- lm(" + this.state.Variables.Outcome[0] + " ~ " + 
              this.state.Variables.Exposure[0]+
              (this.state.AnalysisSetting.DoubleRobust ? " + " + this.state.Variables.Covariates.join(" + ") : "") + ", data = " +
              "boot_data, weights = weights)\n" +
              "  boot_fit$coefficients\n" +
              "}\n\nboot_res <- data.frame(boot_res)\nsapply(boot_res, quantile, c("+ ((1 - this.state.AnalysisSetting.confLv/100)/2).toFixed(3) +", "+ (1-(1 - this.state.AnalysisSetting.confLv/100)/2).toFixed(3) + "))\n"

            }
          }else if (this.state.AnalysisSetting.OutcomeModel == "glm") {
            codeString = codeString + "res <- glm(" + this.state.Variables.Outcome[0] + " ~ " + 
            this.state.Variables.Exposure[0] + ", data = " +
            "matched_data, weights = weights, " +
            "\n  family = "+ (this.state.AnalysisSetting.Link == "logit" ? "quasibinomial(link = \"logit\")" : (this.state.AnalysisSetting.Link == "log" ? "quasipoisson(link = \"log\")": "gaussian(link = \"identity\")") ) + ")\n" +
            "coeftest(res, vcov. = vcovCL, cluster = ~subclass" + (this.state.AnalysisSetting.Replacement && this.state.AnalysisSetting.Method != "full" && this.state.AnalysisSetting.Method != "optimal" ? "+ id" : "") + ")"

            if (this.state.AnalysisSetting.Boot && !this.state.AnalysisSetting.Replacement) {
              codeString = codeString + "\n\nlibrary(doParallel)\nlibrary(foreach)\n\ncl <- makeCluster(detectCores()-1)\nregisterDoParallel(cl)\nboot_res <- NULL\nboot_n <- 5000\n" +
              "pair_ids <- levels(matched_data$subclass)\n\n" +
              "boot_res <- foreach(k = (1:boot_n), .combine = \'rbind\') %dopar% {\n" +
              "  boot_sample_ids <- sample(pair_ids, replace = TRUE)\n" +
              "  num_present_in_boot_sample <- table(boot_sample_ids)\n" +
              "  ids <- unlist(lapply(pair_ids[pair_ids %in% names(num_present_in_boot_sample)],\n" +
              "    function(p) rep(which(matched_data$subclass == p),\n" +
              "    num_present_in_boot_sample[p])))\n" +
              "  boot_data <- matched_data[ids, ]\n" +
              "  boot_fit <- glm(" + this.state.Variables.Outcome[0] + " ~ " + 
              this.state.Variables.Exposure[0] + ", data = " +
              "boot_data, weights = weights, " +
              "\n  family = "+ (this.state.AnalysisSetting.Link == "logit" ? "quasibinomial(link = \"logit\")" : (this.state.AnalysisSetting.Link == "log" ? "quasipoisson(link = \"log\")": "gaussian(link = \"identity\")") ) + ")\n" +
              "  boot_fit$coefficients\n" +
              "}\n\nboot_res <- data.frame(boot_res)\nsapply(boot_res, quantile, c("+ ((1 - this.state.AnalysisSetting.confLv/100)/2).toFixed(3) +", "+ (1-(1 - this.state.AnalysisSetting.confLv/100)/2).toFixed(3) + "))\n"
            }
          }
        }
      }
      
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
      case "confLv":
      case "Ratio":
      case "Method":
      case "Distance":
      case "OutcomeModel":
      case "Link":
        AnalysisSettingObj[target] = event.target.value
        break;
      case "Plot":
      case "EstOutcome":
      case "DoubleRobust":
      case "ImputedDataset":
      case "ImputeMissing":
      case "Replacement":
      case "Boot":
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
      {this.props.currentActiveAnalysisPanel === "MatchingPanel" &&
        <div>  
          <Alert showAlert = {this.state.showAlert} closeAlertCallback = {this.closeAlert}
          title = {this.state.alertTitle}
          content = {this.state.alertText}></Alert>        
          <ExpansionPanel square expanded={this.state.panels.variableSelection}
          onChange = {this.handlePanelExpansion("variableSelection")}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography>Matching</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails onMouseLeave={this.buildCode} onBlur={this.buildCode}>
              <MatchingVariableSelection CurrentVariableList = {this.props.CurrentVariableList}
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
              <MatchingAnalysisSetting 
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