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

export class ScatterplotDataVizSetting extends Component {

    render () {
        return (
            <div>
                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.fittedLine} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"fittedLine")}/>Add a fitted line <span hidden={!this.props.AnalysisSetting.fittedLine}>using &nbsp;
                <select className="select-box" onChange={(event) => this.props.updateAnalysisSettingCallback(event, "fittedLineType")}>
                    <option value="lm">Linear regression</option>
                    <option value="loess">Smooth Curve using Loess regression</option>
                </select></span></div>    

                <div className="NMACheckbox pl-3" hidden={!this.props.AnalysisSetting.fittedLine}><Checkbox checked = {this.props.AnalysisSetting.confInt} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"confInt")}/>Add &nbsp;
                <input className = "AnalysisSettingInput"
                    style={{width: "50px"}}
                        value = {this.props.AnalysisSetting.confIntLevel}
                        onChange = {(event) => this.props.updateAnalysisSettingCallback(event, "confIntLevel")}></input>% confidence band
                </div>

                <div className="NMACheckbox pl-3" hidden={!this.props.AnalysisSetting.fittedLine || this.props.Variables.Shape.length === 0}><Checkbox checked = {this.props.AnalysisSetting.byShape} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"byShape")}/>By point shape
                </div>        

                <div className="NMACheckbox pl-3" hidden={!this.props.AnalysisSetting.fittedLine || this.props.Variables.FillColor === 0}><Checkbox checked = {this.props.AnalysisSetting.byFillColor} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"byFillColor")}/>By fill color
                </div>        
                
                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.jitter} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"jitter")}/>Add Jitter (random noise to points to avoid points overlapping)
                </div>   

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.rug} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"rug")}/>Add rug on sides
                </div>      

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.scale_x_log10} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"scale_x_log10")}/>Log scale for the horizontal axis
                </div>   

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.scale_y_log10} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"scale_y_log10")}/>Log scale for the vertical axis
                </div>   
                

                <br/>
                <div hidden={this.props.Variables.Frame.length === 0}>
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

                <div className="NMACheckbox" hidden={true}><Checkbox checked = {this.props.AnalysisSetting.marginalPlot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"marginalPlot")}/>Add Marginal Plots <span hidden={!this.props.AnalysisSetting.marginalPlot}>using &nbsp;
                <select className="select-box" onChange={(event) => this.props.updateAnalysisSettingCallback(event, "marginalPlotType")}>
                    <option value="histogram">Histogram</option>
                    <option value="density">Density plot</option>
                    <option value="boxplot">Boxplot</option>
                </select></span></div> 

                <div className="NMACheckbox" hidden = {!this.props.imputedDataset}><Checkbox checked = {this.props.AnalysisSetting.originalData} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"originalData")}/>Plot using original data
                <StyledTooltip title="For imputed dataset, the original data will be plotted. Uncheck this to plot the first imputed dataset.">
                <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
            </div>
        )
    }
}