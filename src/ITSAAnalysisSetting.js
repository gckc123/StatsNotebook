import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import TextField from '@material-ui/core/TextField';

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);
 
const StyledTextField = withStyles({
    root: {
        width: "150px",
        '& .MuiInput-underline:after': {
            borderBottomColor: 'black'
          },
    },
})(TextField);

export class ITSAAnalysisSetting extends Component {
    
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

                <div className="NMA-Analysis-Box">
                    <div className="InvisibleBottomBorder">Autocorrelation - Lag:</div>
                    <div><StyledTextField value={this.props.AnalysisSetting.AutoCorrelation}
                    type = "number"
                    inputProps={{style:{fontSize: 14}}}
                    onChange = {(event) => this.props.updateAnalysisSettingCallback(event,"AutoCorrelation")}
                    ></StyledTextField></div>
                </div> 

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.Plot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Plot")} />ITSA plot
                </div> 

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.ACF} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ACF")} />ACF/ PACF
                    <StyledTooltip title="Plotting the Autocorrelation Function and the Partial Autocorrelation function">
                    <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div> 

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.PhaseIn} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"PhaseIn")} />Phase-In period
                    <StyledTooltip title="Enter the starting and ending time of the Phase-in period.">
                    <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div> 

                <div className = "NMA-Analysis-Box">
                    <div className="InvisibleBottomBorder pl-3" hidden = {!this.props.AnalysisSetting.PhaseIn}>
                    &nbsp;	&nbsp;	&nbsp;Start</div> 
                    <div hidden = {!this.props.AnalysisSetting.PhaseIn}><StyledTextField
                    inputProps={{style:{fontSize: 14}}}
                    type = "number"
                    value = {this.props.AnalysisSetting.PhaseInStart}
                    onChange = {(event) => this.props.updateAnalysisSettingCallback(event,"PhaseInStart")}
                    ></StyledTextField></div>
                    <div className="InvisibleBottomBorder pl-3" hidden = {!this.props.AnalysisSetting.PhaseIn}>
                    &nbsp;	&nbsp;	&nbsp;End</div> 
                    <div hidden = {!this.props.AnalysisSetting.PhaseIn}><StyledTextField
                    inputProps={{style:{fontSize: 14}}}
                    type = "number"
                    value = {this.props.AnalysisSetting.PhaseInEnd}
                    onChange = {(event) => this.props.updateAnalysisSettingCallback(event,"PhaseInEnd")}
                    ></StyledTextField></div>
                </div>
                
                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.Harmonic} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Harmonic")} />Harmonic terms for seasonality adjustment
                    <StyledTooltip title="Using sine/cosine pairs to adjust for seasonality. Enter the number of pairs and number of time point for one period cycle.">
                    <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div> 

                <div className = "NMA-Analysis-Box">
                    <div className="InvisibleBottomBorder pl-3" hidden = {!this.props.AnalysisSetting.Harmonic}>
                    &nbsp;	&nbsp;	&nbsp;Number of pairs</div> 
                    <div hidden = {!this.props.AnalysisSetting.Harmonic}><StyledTextField 
                    inputProps={{style:{fontSize: 14}}}
                    value = {this.props.AnalysisSetting.HarmonicPair}
                    onChange = {(event) => this.props.updateAnalysisSettingCallback(event,"HarmonicPair")}
                    type = "number"
                    ></StyledTextField></div>
                    <div className="InvisibleBottomBorder pl-3" hidden = {!this.props.AnalysisSetting.Harmonic}>
                    &nbsp;	&nbsp;	&nbsp;Time point in a period cycle</div> 
                    <div hidden = {!this.props.AnalysisSetting.Harmonic}><StyledTextField inputProps={{style:{fontSize: 14}}}
                    value = {this.props.AnalysisSetting.HarmonicPeriod}
                    onChange = {(event) => this.props.updateAnalysisSettingCallback(event,"HarmonicPeriod")}
                    type = "number"
                    ></StyledTextField></div>
                </div>

                

                
            </div>
        )
    }
}