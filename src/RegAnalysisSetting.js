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
        if (this.props.currentActiveAnalysisPanel === "LRPanel") {
            return (
                <div>
                    <div className="NMACheckbox"><Checkbox  size="small"/>Robust Regression
                    </div>
                    <div className="NMACheckbox"><Checkbox  size="small"/>This is an Imputed Dataset.
                    </div>
                </div>
            )
        }
        return (
            null
        )
    }
}