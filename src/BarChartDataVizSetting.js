import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);

 
export class BarChartDataVizSetting extends Component {

    render () {
        return (
            <div>
                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.coord_flip} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"coord_flip")}/>Flip horizontal and vertical axis</div>
                <div className="NMACheckbox" hidden = {this.props.Variables.FillColor.length === 0 || this.props.Variables.Vertical.length > 0}><Checkbox checked = {this.props.AnalysisSetting.fill} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"fill")}/>Fill Chart</div>
                <div className="NMACheckbox" hidden = {this.props.Variables.FillColor.length === 0 || this.props.Variables.Vertical.length > 0}><Checkbox checked = {this.props.AnalysisSetting.dodge} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"dodge")}/>Separate bars by {this.props.Variables.FillColor[0]}</div>              
                <div className="NMACheckbox" hidden = {!this.props.imputedDataset}><Checkbox checked = {this.props.AnalysisSetting.originalData} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"originalData")}/>Plot using original data
                <StyledTooltip title="For imputed dataset, the original data will be plotted. Uncheck this to plot the first imputed dataset.">
                <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>                  
            </div>
        )
    }
}