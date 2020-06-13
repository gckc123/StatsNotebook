import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';

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
  
export class NMAAnalysisSetting extends Component {
    
    render () {
        return (
            <div>
                <div className="NMA-Analysis-Box">
                    <div>Effect size:</div>
                    <div> 
                        <FormControl>
                            <StyledNativeSelect
                            value={this.props.AnalysisSetting.ESType}
                            onChange={(event) => this.props.updateAnalysisSettingCallback(event, "ESType")}
                            inputProps={{style: {fontSize: 14, minWidth: "100px"}}}>
                                <option value="">----- Select Effect Size -----</option>
                                <option value="RR">Risk Ratio</option>
                                <option value="OR">Odds Ratio</option>
                                <option value="HR">Hazard ratio</option>
                                <option value="RD">Risk Difference</option>
                                <option value="MD">Mean difference</option>
                                <option value="SMD">Standardized mean difference</option>
                            </StyledNativeSelect>
                        </FormControl>
                    </div>
                    <div className="InvisibleBottomBorder">Confidence Interval:</div> 
                    <div><input className="NMAAnalysisSettingInput"
                    defaultValue = {this.props.AnalysisSetting.ConfLv}
                    onBlur = {(event) => this.props.updateAnalysisSettingCallback(event,"ConfLv")}
                    onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event,"ConfLv")}></input>%</div>
                    <div className="NMACheckbox InvisibleBottomBorder"><Checkbox checked = {this.props.AnalysisSetting.ForestPlot} size="small"
                    onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ForestPlot")}/>Forest plot 
                    <span hidden= {!this.props.AnalysisSetting.ForestPlot}> - Reference: </span>
                    </div>
                    <div><input className="NMAAnalysisSettingInput" hidden= {!this.props.AnalysisSetting.ForestPlot}
                    onBlur = {(event) => this.props.updateAnalysisSettingCallback(event,"ForestPlotRef")}
                    onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event,"ForestPlotRef")}></input></div>
                </div>
                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.HeatPlot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"HeatPlot")}/>Heat plot</div>     
                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.NetworkPlot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"NetworkPlot")}/>Network plot</div>
                 
               
            </div>
        )
    }
}