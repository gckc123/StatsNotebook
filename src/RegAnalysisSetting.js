import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);

export class RegAnalysisSetting extends Component {
    
    render () {
        let currentPanel = this.props.currentActiveAnalysisPanel
        if (currentPanel === "LRPanel" || currentPanel === "LogitPanel" ||
        currentPanel === "PoiPanel" || currentPanel === "NbPanel" || currentPanel === "MultinomPanel") {
            return (
                <div>
                    <div className = "NMA-Analysis-Box">
                        <div className = "InvisibleBottomBorder">Confidence Interval:</div>
                        <div><input className = "NMAAnalysisSettingInput"
                        value = {this.props.AnalysisSetting[currentPanel].confLv}
                        onChange = {(event) => this.props.updateAnalysisSettingCallback(event, currentPanel, "confLv")}
                        ></input>%</div>
                    </div>

                    {(currentPanel === "LogitPanel" || currentPanel === "PoiPanel" || currentPanel === "NbPanel" || currentPanel === "MultinomPanel") &&
                        <div className="NMACheckbox"><Checkbox size="small"
                        checked= {this.props.AnalysisSetting[currentPanel].expCoeff}
                        onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"expCoeff")}/>Exponentiate model coefficients
                            <StyledTooltip title="Exponentiate the model coefficients to obtain odds ratio/risk ratio/relative risk ratio.">
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                        </div>
                    }

                    {(currentPanel === "LRPanel") &&
                        <div className="NMACheckbox"><Checkbox size="small"
                        disabled = {((this.props.AnalysisSetting[currentPanel].imputedDataset || this.props.AnalysisSetting[currentPanel].imputeMissing) && this.props.Variables.RandomEffect.length > 0)
                        || this.props.Variables.Weight.length > 0}
                        checked= {this.props.AnalysisSetting[currentPanel].robustReg}
                        onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"robustReg")}/>Robust Regression
                            <StyledTooltip title={<div>Robust regression is not available for imputed Dataset when random effect is present. <br/><br/>Robust regression is not available for weighted analysis. <br/><br/>It should be noted that robust regression might not always produce a convergent solution.</div>}>
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                        </div>
                    }

                    <div className="NMACheckbox"><Checkbox  size="small" 
                    disabled = {this.props.AnalysisSetting[currentPanel].imputeMissing}
                    checked = {this.props.AnalysisSetting[currentPanel].imputedDataset}
                    onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"imputedDataset")}/>This is an Imputed Dataset.
                        <StyledTooltip title="Click this if the data is already an imputed dataset.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                    <div className="NMACheckbox"><Checkbox size="small" 
                    disabled = {this.props.AnalysisSetting[currentPanel].imputedDataset}
                    checked = {this.props.AnalysisSetting[currentPanel].imputeMissing}
                    onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"imputeMissing")}/>Impute missing data
                        <StyledTooltip title="Multiple imputation will be used to impute missing data. Random effects will not be used for imputation. If existing data is an imputed dataset, missing data will be reimputed using the analysis variables.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                    <div className ="NMA-Analysis-Box pl-3" hidden = {!this.props.AnalysisSetting[currentPanel].imputeMissing}>
                        <div className="InvisibleBottomBorder pl-4 pt-1">Number of imputation:
                        <StyledTooltip title="The actual number depends on the number of computer cores and may be slightly more than the number specified.">
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                        </div>
                        <div className="pt-1">
                        <TextField
                            type="number"
                            inputProps= {{
                                style: {fontSize: 15}
                            }}
                            className = "Analysis-Setting-TextField"
                            defaultValue = {this.props.AnalysisSetting.M}
                            onChange={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"M")}
                            ></TextField>
                        </div>
                    </div>
                    
                    {(currentPanel !== "NbPanel" && currentPanel !== "MultinomPanel") &&
                    <div className="NMACheckbox"><Checkbox  size="small" 
                    disabled = {this.props.AnalysisSetting[currentPanel].robustReg ||
                        ((currentPanel === "LogitPanel" || currentPanel === "PoiPanel") && (this.props.Variables.RandomEffect.length > 0))}
                    checked = {this.props.AnalysisSetting[currentPanel].diagnosticPlot}
                    onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"diagnosticPlot")}/>Diagnostic plots and tests
                        <StyledTooltip title="If missing data is imputed using multiple imputation, diagnostic plots are based on the first imputed dataset. Diagnostic plots are not available for robust regression.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                    }
                </div>
            )
        }
        return (
            null
        )
    }
}