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
 
export class MIAnalysisSetting extends Component {
    
    render () {
        return (
            <div>
                <div className="NMA-Analysis-Box">
                    <div className="InvisibleBottomBorder">Confidence Interval:</div>
                    <div><input defaultValue={this.props.AnalysisSetting.ConfLv}
                    className="NMAAnalysisSettingInput"
                    onBlur = {(event) => this.props.updateAnalysisSettingCallback(event,"ConfLv")}
                    onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event,"ConfLv")}></input>%</div>
                </div> 
            </div>
        )
    }
}