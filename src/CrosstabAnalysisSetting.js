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
                </div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.ColPercent} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ColPercent")}/>Column Percentage
                </div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.OverallPercent} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"OverallPercent")}/>Overall Percentage</div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.ChisqTest} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ChisqTest")}/>Chi-sq Test</div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.FisherTest} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"FisherTest")}/>Fisher's Exact Test</div>
            </div>
            </div>
        )
    }
}