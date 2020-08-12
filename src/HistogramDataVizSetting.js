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
  
export class HistogramDataVizSetting extends Component {

    render () {
        return (
            <div>
                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.Density} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Density")}/>Density</div>    

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.Polygon} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Polygon")}/>Polygon</div>    

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.SetBinWidth} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"SetBinWidth")}/>Set Bin Width
                <StyledTooltip title="R will automatically determine the width of each bin in the histogram. You can manually set the bin width here.">
                <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                <div className="Histogram-Two-Column-Box pl-3" hidden = {!this.props.AnalysisSetting.SetBinWidth}>
                    <div className="InvisibleBottomBorder pl-4 pt-1">Bin Width: 
                    </div>
                    <div className="pt-1">
                        <TextField
                            type="number"
                            inputProps= {{
                                style: {fontSize: 15}
                            }}
                            className = "Analysis-Setting-TextField"
                            defaultValue = {this.props.AnalysisSetting.M}
                            onChange={(event) => this.props.updateAnalysisSettingCallback(event, "BinWidth")}
                            ></TextField>
                    </div>
                </div>
                


            </div>
        )
    }
}