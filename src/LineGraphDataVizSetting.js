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
  
export class LineGraphDataVizSetting extends Component {

    render () {
        return (
            <div>

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.scale_x_log10} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"scale_x_log10")}/>Log scale for the horizontal axis
                </div>   

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.scale_y_log10} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"scale_y_log10")}/>Log scale for the vertical axis
                </div>   

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.animate} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"animate")}/>Animate
                </div> 
                <div hidden={!this.props.AnalysisSetting.animate} className="pl-4 pt=2">
                    <div className="pb-2">Animated plot setting</div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Width</div>
                        <div><input value={this.props.AnalysisSetting.ani_width} className="LabelAndThemeSettingInput" style={{width: "350px"}} onChange={(event) => this.props.updateAnalysisSettingCallback(event,"ani_width")}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Height</div>
                        <div><input value={this.props.AnalysisSetting.ani_height} className="LabelAndThemeSettingInput" style={{width: "350px"}} onChange={(event) => this.props.updateAnalysisSettingCallback(event,"ani_height")}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">File name</div>
                        <div><input className="LabelAndThemeSettingInput" style={{width: "350px"}} 
                            value={this.props.AnalysisSetting.ani_file} onChange={(event) => this.props.updateAnalysisSettingCallback(event, "ani_file")}></input></div>
                    </div>
                </div>

                <div className="NMACheckbox" hidden = {!this.props.imputedDataset}><Checkbox checked = {this.props.AnalysisSetting.originalData} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"originalData")}/>Plot using original data
                <StyledTooltip title="For imputed dataset, the original data will be plotted. Uncheck this to plot the first imputed dataset.">
                <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
            </div>
        )
    }
}