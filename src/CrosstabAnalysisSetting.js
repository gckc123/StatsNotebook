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
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.RowPercent} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"RowPercent")}/>Row Percentage
                        <StyledTooltip title="Row percentage is not available when the analysis is split by other variables.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.ColPercent} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ColPercent")}/>Column Percentage
                        <StyledTooltip title="Column percentage is not available when the analysis is split by other variables.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.OverallPercent} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"OverallPercent")}/>Overall Percentage
                        <StyledTooltip title="Overall percentage is not available when the analysis is split by other variables.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                        </div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.ChisqTest} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ChisqTest")}/>Chi-sq Test
                        <StyledTooltip title="Chi-sq test is used to examine association between two categorical variables. Use Fisher's test if the any of the expected cell count is less than 5.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.FisherTest} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"FisherTest")}/>Fisher's Exact Test
                        <StyledTooltip title="Fisher's test is for small sample and might throw an error for large sample.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
            </div>
            </div>
        )
    }
}