import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);
  


export class IPTWAnalysisSetting extends Component {
    
    render () {
        return (
            <div>
                <div className="NMA-Analysis-Box">
                    <div className="InvisibleBottomBorder">Number of imputation:
                    <StyledTooltip title="The actual number depends on the number of computer cores and may be slightly more than the number specified.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                    <div><TextField 
                    type="number"
                    inputProps={{
                        style: {fontSize: 15} 
                      }}
                    className="Analysis-Setting-TextField"
                    value={this.props.AnalysisSetting.M}
                    onChange = {(event) => this.props.updateAnalysisSettingCallback(event,"M")}
                    /></div>
                </div> 
            </div>
        )
    }
}