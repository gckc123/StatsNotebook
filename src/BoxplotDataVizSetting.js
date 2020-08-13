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
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField'

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);

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
  
export class BoxplotDataVizSetting extends Component {

    render () {
        return (
            <div>
                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.violinPlot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"violinPlot")}/>Violin Plot</div>    
                
                <div className="NMACheckbox" hidden = {this.props.Variables.Horizontal.length === 0 || this.props.Variables.violinPlot}><Checkbox checked = {this.props.AnalysisSetting.varWidth} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"varWidth")}/>Box width proportional to sample size</div> 

                <div className="NMACheckbox" hidden = {true}><Checkbox checked = {this.props.AnalysisSetting.meanValue} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"meanValue")}/>Add mean values</div> 

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.individualObs} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"individualObs")}/>Show individual observations</div> 

                <div className="NMACheckbox" hidden = {true || this.props.Variables.Horizontal.length === 0}><Checkbox checked = {this.props.AnalysisSetting.reorderUp} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"reorderUp")}/>Order the box ascendingly by {this.props.Variables.Horizontal[0]}</div> 

                <div className="NMACheckbox" hidden = {true || this.props.Variables.Horizontal.length === 0}><Checkbox checked = {this.props.AnalysisSetting.reorderDown} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"reorderDown")}/>Order the box descendingly by {this.props.Variables.Horizontal[0]}</div> 

                <div className="NMACheckbox" hidden = {!this.props.imputedDataset}><Checkbox checked = {this.props.AnalysisSetting.originalData} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"originalData")}/>Plot using original data
                <StyledTooltip title="For imputed dataset, the original data will be plotted. Uncheck this to plot the first imputed dataset.">
                <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
            </div>
        )
    }
}