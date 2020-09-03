import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);
 
export class CrosstabAnalysisSetting extends Component {
    
    render () {
        return (
            <div>
                <div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.IncludeNA} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"IncludeNA")}/>Include Missing (NA)
                        </div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.RowPercent} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"RowPercent")}
                        disabled={this.props.Variables.SplitBy.length > 0}/>Row Percentage
                        <StyledTooltip title="Row percentage is not available when the analysis is split by other variables.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.ColPercent} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ColPercent")}
                        disabled={this.props.Variables.ColVars.length === 0 || this.props.Variables.SplitBy.length > 0}/>Column Percentage
                        <StyledTooltip title="Column percentage is not available when the analysis is split by other variables.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.OverallPercent} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"OverallPercent")}
                        disabled={this.props.Variables.ColVars.length === 0 || this.props.Variables.SplitBy.length > 0}/>Overall Percentage
                        <StyledTooltip title="Overall percentage is not available when the analysis is split by other variables.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                        </div>
                
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.ChisqTest} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ChisqTest")}
                        disabled={this.props.Variables.ColVars.length === 0 || this.props.Variables.SplitBy.length > 0}/>Chi-sq Test
                        <StyledTooltip title={<div>Chi-sq test is used to examine association between two categorical variables. Use Fisher's test if the any of the expected cell count is less than 5.<br/><br/>
                        Not available when the analysis is split by other variables.</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.FisherTest} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"FisherTest")}
                        disabled={this.props.Variables.ColVars.length === 0 || this.props.Variables.SplitBy.length > 0 || this.props.Variables.Weight.length > 0}/>Fisher's Exact Test
                        <StyledTooltip title={<div>Fisher's test is for small sample and might throw an error for large sample.<br/><br/>
                        Not available when the analysis is split by other variables.<br/>
                        Not available when the data is weighted.</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                <div className="AnalysisSettingCheckBox" hidden = {!this.props.imputedDataset}><Checkbox checked = {this.props.AnalysisSetting.OriginalData} size="small"
                        
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"OriginalData")}/>Use original data
                        <StyledTooltip title={<div>For imputed dataset, the original data will be analyzed. Uncheck this to analyze the first imputed dataset.</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                        </div>
            </div>
            </div>
        )
    }
}