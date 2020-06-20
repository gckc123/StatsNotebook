import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Checkbox from '@material-ui/core/Checkbox';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';

const StyledButton = withStyles({
    root: {
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&:focus': {
            outline: 'none',
        },
    },
     label: {
        textTransform: 'none',
     }   
})(IconButton);

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
    
    genForestPlotRef = () => {
        if (this.props.TreatmentLvs.length !==0) {
            return (
                    <FormControl>
                            <StyledNativeSelect
                            key="ForestPlotRef"
                            value={this.props.AnalysisSetting.ForestPlotRef}
                            onChange={(event) => this.props.updateAnalysisSettingCallback(event, "ForestPlotRef")}
                            inputProps={{style: {fontSize: 14, minWidth: "100px"}}}>
                                <option value = "" key="default">--- Select Reference Level ---</option>
                                {
                                    this.props.TreatmentLvs.map((item) => {
                                        return (
                                            <React.Fragment key={item}>
                                                <option value={item} key={item}>{item}</option>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </StyledNativeSelect>
                        </FormControl>
            )
        }
    }



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
                    <div hidden= {!this.props.AnalysisSetting.ForestPlot}>
                        {this.genForestPlotRef()}
                    </div>
                </div>
                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.HeatPlot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"HeatPlot")}/>Heat plot</div>     
                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.NetworkPlot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"NetworkPlot")}/>Network plot</div>
                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.FunnelPlot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"FunnelPlot")}/>Funnel plot</div>
                <div hidden={!this.props.AnalysisSetting.FunnelPlot}><div className="pl-2 mt-1 mb-1">Funnel plot order:</div>
                {
                    this.props.TreatmentLvs.map((item, index) => {
                        return (
                            <div className="pl-3" key={item}>
                            <StyledButton size="small"
                            onClick={() => this.props.reorderTreatmentLvCallback("Up",index)} disableRipple><FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon></StyledButton>
                            <StyledButton size="small"
                            onClick={() => this.props.reorderTreatmentLvCallback("Down",index)} disableRipple><FontAwesomeIcon icon={faArrowDown}></FontAwesomeIcon></StyledButton>
                            <span className="pl-2">{item}</span>
                            </div>                            
                        )
                    })
                }
                </div>


            </div>
        )
    }
}