import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);
  
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

export class IPTWAnalysisSetting extends Component {
    
    render () {
        return (
            <div>
                    <div className="NMA-Analysis-Box">
                        <div className="pl-2">Distribution family</div>
                        <div>
                        <FormControl>
                            <StyledNativeSelect
                            value={this.props.AnalysisSetting.family}
                            onChange={(event) => this.props.updateAnalysisSettingCallback(event, "family")}
                            inputProps={{style: {fontSize: 14, minWidth: "100px"}}}>
                                <option value="">----- Select distribution family -----</option>
                                <option value="binomial">Binomial</option>
                                <option value="gaussian">Gausssian (Normal)</option>
                                <option value="multinomial">Multinomial</option>                                
                            </StyledNativeSelect>
                        </FormControl>
                        </div>
                    </div>
                    <div className="NMACheckbox"><Checkbox size="small"
                        checked= {this.props.AnalysisSetting.imputedDataset}
                        onClick={(event) => this.props.updateAnalysisSettingCallback(event, "imputedDataset")}/>This is an imputed dataset.
                            <StyledTooltip title="Check this if the data is already an imputed dataset.">
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>

                    <div className="NMACheckbox"><Checkbox size="small"
                        checked= {this.props.AnalysisSetting.imputeMissing}
                        onClick={(event) => this.props.updateAnalysisSettingCallback(event, "imputeMissing")}/>Impute missing data.
                            <StyledTooltip title="Check this to impute missing data with multiple imputation.">
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>

                    <div className="NMA-Analysis-Box pl-3" hidden = {!this.props.AnalysisSetting.imputeMissing}>
                        <div className="InvisibleBottomBorder pl-4 pt-1">Number of imputation:
                        <StyledTooltip title="The actual number depends on the number of computer cores and may be slightly more than the number specified.">
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                        </div>
                        <div><TextField 
                        type="number"
                        inputProps={{
                            style: {fontSize: 15} 
                        }}
                        className="Analysis-Setting-TextField"
                        value={this.props.AnalysisSetting.M}
                        onChange = {(event) => this.props.updateAnalysisSettingCallback(event,"M")}
                        /></div>
                    </div>

            </div>
        )
    }
}