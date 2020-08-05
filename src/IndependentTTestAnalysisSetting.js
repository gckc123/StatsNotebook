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

export class IndependentTTestAnalysisSetting extends Component {
    
    render () {
        let currentPanel = this.props.currentActiveAnalysisPanel
            return (
                <div>
                    <div className = "NMA-Analysis-Box">
                        <div className = "InvisibleBottomBorder">Confidence Interval:</div>
                        <div><input className = "NMAAnalysisSettingInput"
                        defaultValue = {this.props.AnalysisSetting[currentPanel].confLv}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, currentPanel, "confLv")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, currentPanel, "confLv")}></input>%</div>
                    </div>

                    

                    <div className="NMACheckbox"><Checkbox size="small" 
                    checked = {this.props.AnalysisSetting[currentPanel].varianceNotEqual}
                    onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"varianceNotEqual")}/>Do not assume equality of variance (homogeneity).
                        <StyledTooltip title={<div>Welch's T-test will be conducted.</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>

                    <div className="NMACheckbox"><Checkbox size="small" 
                    checked = {this.props.AnalysisSetting[currentPanel].varianceNotEqual}
                    onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"robust")}/>Robust Independent T-test
                        <StyledTooltip title={<div>Yuen's test will be conducted on trimmed mean. This test does not assume equality of variance. <br/><br/> Use this test if there are extreme observations and/or the variances acros groups are not the same.</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>

                    <div className="NMACheckbox"><Checkbox size="small" 
                    checked = {this.props.AnalysisSetting[currentPanel].varianceNotEqual}
                    onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"nonParametric")}/>Non-parametric test
                        <StyledTooltip title={<div>Mann Whitney's test will be conducted.</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                                      
                    <div className="NMACheckbox"><Checkbox  size="small" 
                    checked = {this.props.AnalysisSetting[currentPanel].diagnosticPlot}
                    onClick={(event) => this.props.updateAnalysisSettingCallback(event, currentPanel,"diagnosticPlot")}/>Diagnostic plots and tests
                        <StyledTooltip title={<div>QQ plot will be shown and test of homogenity of variance will be performed (Levene's test).</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                    
                </div>
            )
    }
}