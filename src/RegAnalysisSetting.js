import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export class RegAnalysisSetting extends Component {
    
    render () {
        return (
            <div>
                <div className="NMA-Analysis-Box">
                    <div className="InvisibleBottomBorder">Number of imputation:</div>
                    <div><TextField 
                    type="number"
                    inputProps={{
                        style: {fontSize: 15} 
                      }}
                    className="Analysis-Setting-TextField"
                    defaultValue={this.props.AnalysisSetting.M}
                    onBlur = {(event) => this.props.updateAnalysisSettingCallback(event,"M")}
                    onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event,"M")}/></div>
                </div> 
            </div>
        )
    }
}