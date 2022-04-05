import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);
 
const StyledTextField = withStyles({
    root: {
        width: "150px",
        '& .MuiInput-underline:after': {
            borderBottomColor: 'black'
          },
    },
})(TextField);

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

export class MatchingAnalysisSetting extends Component {
    
    render () {
        return (
            <div>

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.ImputedDataset} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ImputedDataset")} />This is an imputed dataset.
                </div> 

                <br/>
                <div className="NMA-Analysis-Box">
                    <div className="InvisibleBottomBorder">Confidence Interval:</div>
                    <div><input value={this.props.AnalysisSetting.confLv}
                    className="NMAAnalysisSettingInput"
                    onChange = {(event) => this.props.updateAnalysisSettingCallback(event,"confLv")}
                    ></input>%</div>
                </div> 

                <div className="NMA-Analysis-Box">
                    <div className="InvisibleBottomBorder">Ratio:</div>
                    <div><StyledTextField value={this.props.AnalysisSetting.Ratio}
                    type = "number"
                    inputProps={{style:{fontSize: 14}}}
                    onChange = {(event) => this.props.updateAnalysisSettingCallback(event,"Ratio")}
                    ></StyledTextField></div>
                </div> 



                <div className="ModelSelectionBox">
                        <div className="ModelSelectionVarCol">
                            Method: 
                        </div>
                        <div>
                            <FormControl>
                                <StyledNativeSelect                                
                                value = {this.props.AnalysisSetting.Method}
                                inputProps={{style: {fontSize: 14}}}
                                variant="filled"
                                onChange={(event) => this.props.updateAnalysisSettingCallback(event,"Method")}>
                                <option value={"nearest"}>Nearest</option>
                                <option value={"optimal"}>Optimal</option>
                                <option value={"full"}>Full</option>
                                </StyledNativeSelect>
                            </FormControl>
                        </div>   
                </div>

                <div className="ModelSelectionBox">
                        <div className="ModelSelectionVarCol">
                            Distance: 
                        </div>
                        <div>
                            <FormControl>
                                <StyledNativeSelect                                
                                value = {this.props.AnalysisSetting.Distance}
                                inputProps={{style: {fontSize: 14}}}
                                variant="filled"
                                onChange={(event) => this.props.updateAnalysisSettingCallback(event,"Distance")}>
                                <option value={"glm"}>Generalised Linear Model</option>
                                <option value={"gbm"}>Generalised Boosted Model</option>
                                </StyledNativeSelect>
                            </FormControl>
                        </div>   
                </div>
                
                <div hidden = {this.props.AnalysisSetting.Method == "optimal" || this.props.AnalysisSetting.Method == "full"}><div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.Replacement} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Replacement")} />With replacement
                </div></div> 

                

                <div className="NMACheckbox"><Checkbox checked = {this.props.AnalysisSetting.EstOutcome} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"EstOutcome")} />Analyse the outcome
                </div> 

                <div hidden = {!this.props.AnalysisSetting.EstOutcome}><div className="ModelSelectionBox">
                        <div className="ModelSelectionVarCol">
                        &nbsp;	&nbsp;	&nbsp;	&nbsp;&nbsp;		Outcome model:
                        </div>
                        <div>
                            <FormControl>
                                <StyledNativeSelect                                
                                value = {this.props.AnalysisSetting.OutcomeModel}
                                inputProps={{style: {fontSize: 14}}}
                                variant="filled"
                                onChange={(event) => this.props.updateAnalysisSettingCallback(event,"OutcomeModel")}>
                                <option value={"lm"}>Linear regression</option>
                                <option value={"glm"}>Generalised Linear Model</option>
                                </StyledNativeSelect>
                            </FormControl>
                        </div>   
                </div></div>

                <div hidden = {!this.props.AnalysisSetting.EstOutcome || !(this.props.AnalysisSetting.OutcomeModel == "glm")}><div className="ModelSelectionBox">
                        <div className="ModelSelectionVarCol">
                        &nbsp;	&nbsp;	&nbsp;	&nbsp;&nbsp;		Link:
                        </div>
                        <div>
                            <FormControl>
                                <StyledNativeSelect                                
                                value = {this.props.AnalysisSetting.Link}
                                inputProps={{style: {fontSize: 14}}}
                                variant="filled"
                                onChange={(event) => this.props.updateAnalysisSettingCallback(event,"Link")}>
                                <option value={"identity"}>Identify</option>
                                <option value={"logit"}>Logit</option>
                                <option value={"log"}>Log</option>
                                </StyledNativeSelect>
                            </FormControl>
                        </div>   
                </div></div>

                <div hidden= {!this.props.AnalysisSetting.EstOutcome || !(this.props.AnalysisSetting.OutcomeModel == "lm")}><div className="NMACheckbox">&nbsp;	&nbsp;	&nbsp;	<Checkbox checked = {this.props.AnalysisSetting.DoubleRobust} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"DoubleRobust")} />Doubly robust estimation
                </div></div> 

                <div hidden = {!this.props.AnalysisSetting.EstOutcome || this.props.AnalysisSetting.Replacement}><div className="NMACheckbox">&nbsp;	&nbsp;	&nbsp;  <Checkbox checked = {this.props.AnalysisSetting.Boot} size="small"
                onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Boot")} />Bootrapping confidence interval
                </div></div> 

            </div>
        )
    }
}