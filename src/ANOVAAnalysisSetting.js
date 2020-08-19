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

export class ANOVAAnalysisSetting extends Component {
    
    render () {
        let currentPanel = this.props.currentActiveAnalysisPanel
            return (
                <div>
                    <div className = "NMA-Analysis-Box">
                        <div className = "InvisibleBottomBorder">Confidence Interval:</div>
                        <div><input className = "NMAAnalysisSettingInput"
                        value = {this.props.AnalysisSetting[currentPanel].confLv}
                        onChange = {(event) => this.props.updateAnalysisSettingCallback(event, currentPanel, "confLv")}
                        ></input>%</div>
                    </div>

                    <div className="NMACheckbox"><Checkbox  size="small" 
                    disabled = {this.props.AnalysisSetting[currentPanel].imputeMissing}
                    checked = {this.props.AnalysisSetting[currentPanel].imputedDataset}
                    onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"imputedDataset")}/>This is an Imputed Dataset.
                        <StyledTooltip title={<div>Click this if the data is already an imputed dataset.<br/><br/>The "lm" (Linear model) function will be used to examine group differences.</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                    <div className="NMACheckbox"><Checkbox size="small" 
                    disabled = {this.props.AnalysisSetting[currentPanel].imputedDataset}
                    checked = {this.props.AnalysisSetting[currentPanel].imputeMissing}
                    onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"imputeMissing")}/>Impute missing data
                        <StyledTooltip title={<div>Multiple imputation will be used to impute missing data. If existing data is an imputed dataset, missing data will be reimputed using the analysis variables. <br/><br/>The "lm" (Linear model) function will be used to examine group differences.</div>}>
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
                    
                    <div className="NMACheckbox"><Checkbox  size="small" 
                    checked = {this.props.AnalysisSetting[currentPanel].diagnosticPlot}
                    onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"diagnosticPlot")}/>Diagnostic plots and tests
                        <StyledTooltip title={<div>QQ plot will be shown and test of homogenity of variance will be performed (Levene's test). <br/><br/>If missing data is imputed using multiple imputation, diagnostic plots and tests will be based on the first imputed dataset.</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                    
                    <div className="NMACheckbox"><Checkbox  size="small" 
                    checked = {this.props.AnalysisSetting[currentPanel].nonParametric}
                    onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"nonParametric")}/>Non-parametric test for all factor variables
                        <StyledTooltip title={<div>Kruskal-Wallis test will be performed on all factor variables.<br/><br/>Pairwise comparisons will be conducted using Wilcox's test. Multiple comparisons will be adjusted for using the method proposed by Benjamini and Hochberg (1995).<br/><br/>If missing data is imputed using multiple imputation, diagnostic plots and tests will be based on the first imputed dataset.</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>

                </div>
            )
    }
}