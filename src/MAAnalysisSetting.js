import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Checkbox from '@material-ui/core/Checkbox';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);


const StyledNativeSelect = withStyles({
    root: {
        '&:focus': {
            outline: 'none',
            background: 'white',
        },
    },
    select: {
        paddingLeft: '5px',
        "&:focus": {
            border: "0px",
            outline: "0px",
        }
    }
  })(NativeSelect);
  
export class MAAnalysisSetting extends Component {
    
    render () {
        return (
            <div>
                <div className="NMA-Analysis-Box">
                    <div className="InvisibleBottomBorder">Confidence Interval:</div>
                    <div><input className="NMAAnalysisSettingInput"></input>%</div>
                </div>
                <div className="NMACheckbox"><Checkbox size="small" />Exponentiate Effect Size
                    <StyledTooltip title="Exponentiate the estimates for Risk/Odds/Hazard ratio">
                    <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div>
                <div className="NMACheckbox"><Checkbox size="small" />Fixed Effect Model
                    <StyledTooltip title="Random effect model is used by default.">
                    <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                </div> 
                <div className="NMACheckbox"><Checkbox size="small" />Leave one out</div> 
                <div className="NMACheckbox"><Checkbox size="small" />Trim and Fill</div> 
                <div className="NMACheckbox"><Checkbox size="small" />Forest Plot</div> 
                <div className="NMACheckbox"><Checkbox size="small" />Funnel Plot with Test of Asymmetry</div> 
                <div className="NMACheckbox"><Checkbox size="small" />Diagnostic and Residual Plot</div> 
            </div>
        )
    }
}