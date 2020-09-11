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
 
export class MAAnalysisSetting extends Component {
    
    render () {
        return (
            <div>
                <div className="NMA-Analysis-Box">
                    <div className="InvisibleBottomBorder">Confidence Interval:</div>
                    <div><input value={this.props.AnalysisSetting.ConfLv}
                    className="NMAAnalysisSettingInput"
                    onChange = {(event) => this.props.updateAnalysisSettingCallback(event,"ConfLv")}
                    ></input>%</div>
                </div> 

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.LogES} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"LogES")} />Log transformation required for the effect size
                    <StyledTooltip title="If the effect size was Odd ratio, risk ratio or hazard ratio, log transformation is required.">
                    <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div> 

                <div className = "NMA-Analysis-Box">
                    <div className="InvisibleBottomBorder pl-3" hidden = {!this.props.AnalysisSetting.LogES}>
                    &nbsp;	&nbsp;	&nbsp;C.I. for Std. Err. Calculation:</div> 
                    <div hidden = {!this.props.AnalysisSetting.LogES}><input className="NMAAnalysisSettingInput"
                    value = {this.props.AnalysisSetting.ConfForSE}
                    onChange = {(event) => this.props.updateAnalysisSettingCallback(event,"ConfForSE")}
                    ></input>%</div>
                </div>

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.FixedEffect} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"FixedEffect")} />Fixed Effect Model
                    <StyledTooltip title="Random effect model is used by default.">
                    <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div> 

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.Leave1Out} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Leave1Out")}
                disabled = {this.props.Variables.Covariates.length > 0}/>Leave one out 
                <StyledTooltip title="Leave one out analysis is only available for meta-analysis (with no covariate).">
                    <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div> 

                <div className="NMACheckbox" ><Checkbox checked = {this.props.AnalysisSetting.TrimAndFill} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"TrimAndFill")} 
                disabled = {this.props.Variables.Covariates.length > 0}/>Trim and Fill
                <StyledTooltip title="Trim and Fill analysis is only available for meta-analysis (with no covariate).">
                    <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div> 

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.ForestPlot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ForestPlot")} />Forest Plot</div>

                <div className="NMACheckbox pl-3" hidden = {!this.props.AnalysisSetting.ForestPlot}><Checkbox checked = {this.props.AnalysisSetting.Exponentiate} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Exponentiate")} />Exponentiate Effect Size in the Forest Plot
                    <StyledTooltip title="Exponentiate the estimates for Risk/Odds/Hazard ratio">
                    <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div> 

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.FunnelPlot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"FunnelPlot")}/>Funnel Plot with Test of Asymmetry</div> 

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.DiagnosticPlot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"DiagnosticPlot")} />Diagnostic and Residual Plot</div> 
            </div>
        )
    }
}