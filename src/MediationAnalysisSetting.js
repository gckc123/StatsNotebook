import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

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
  
export class MediationAnalysisSetting extends Component {
    
    genModelSelection = () => {
        let varList = this.props.Variables.Outcome.concat(this.props.Variables.Mediator)

        return (
            varList.map((item) => {
                return (
                    <div className="ModelSelectionBox" key={item}>
                        <div className="ModelSelectionVarCol">    
                            {item}
                        </div>
                        <div>
                            <FormControl>
                                <StyledNativeSelect                                
                                value = {this.props.AnalysisSetting.Models[item]}
                                inputProps={{style: {fontSize: 14}}}
                                variant="filled"
                                name={item}
                                onChange={(event) => this.props.updateAnalysisSettingCallback(event,"ModelSelection")}>
                                <option value={""}>----- Select Model -----</option>
                                <option value={"regression"}>Regression (Continuous variable)</option>
                                <option value={"logistic regression"}>Logistic regression (Dichotomized variable)</option>
                                <option value={"poisson regression"}>Poisson regression (Count variable)</option>
                                </StyledNativeSelect>
                            </FormControl>
                        </div>   
                    </div>
                )
            })
        )
    }

    getExposureLvs = () => {
        
    }

    render () {
        return (
            <div>
                <div className="ModelSelectionBox">
                    <div>Variables</div>
                    <div>Models</div>
                </div>    
                {this.genModelSelection()}
                
                
                <Divider className="mt-2 mb-2"/>
                
                <div className = "ModelSelectionOptionSet">
                    <div className="InvisibleBottomBorder">Treatment level:</div>
                    <div><input className="ModelSelectionInput" 
                    onChange={(event) => this.props.updateAnalysisSettingCallback(event,"TreatLv")} 
                    value={this.props.AnalysisSetting.TreatLv} hidden = {this.props.AnalysisSetting.catExposure}/>
                    <FormControl>
                                <StyledNativeSelect hidden = {!this.props.AnalysisSetting.catExposure}
                                value={this.props.AnalysisSetting.Simulation}
                                onChange={(event) => this.props.updateAnalysisSettingCallback(event, "TreatLv")}
                                inputProps={{style: {fontSize: 14, minWidth: "100px"}}}>
                                <option value={100}>100</option>
                                <option value={1000}>1000</option>
                                <option value={2000}>2000</option>
                                <option value={5000}>5000</option>
                                <option value={10000}>10000</option>
                                <option value={20000}>20000</option>
                                <option value={50000}>50000</option>
                                </StyledNativeSelect>
                    </FormControl>
                    </div>
                    <div className="InvisibleBottomBorder">Control level:</div>
                    <div><input className="ModelSelectionInput" 
                    onChange={(event) => this.props.updateAnalysisSettingCallback(event,"ControlLv")}
                    value={this.props.AnalysisSetting.ControlLv} hidden = {this.props.AnalysisSetting.catExposure}/>
                    <FormControl>
                                <StyledNativeSelect hidden = {!this.props.AnalysisSetting.catExposure}
                                value={this.props.AnalysisSetting.Simulation}
                                onChange={(event) => this.props.updateAnalysisSettingCallback(event, "ControlLv")}
                                inputProps={{style: {fontSize: 14, minWidth: "100px"}}}>
                                <option value={100}>100</option>
                                <option value={1000}>1000</option>
                                <option value={2000}>2000</option>
                                <option value={5000}>5000</option>
                                <option value={10000}>10000</option>
                                <option value={20000}>20000</option>
                                <option value={50000}>50000</option>
                                </StyledNativeSelect>
                    </FormControl>
                    </div>
                    <div className="InvisibleBottomBorder">Confidence Intervel:</div>
                    <div><input className="ModelSelectionInput"
                    onChange={(event) => this.props.updateAnalysisSettingCallback(event,"ConfLv")} 
                    value={this.props.AnalysisSetting.ConfLv}/>%</div>
                    <div className="InvisibleBottomBorder">Number of digits:</div>
                    <div><input className="ModelSelectionInput"
                    onChange={(event) => this.props.updateAnalysisSettingCallback(event,"Digits")} 
                    value={this.props.AnalysisSetting.Digits}/></div>
                    <div>Simulation:</div>
                    <div>
                        <FormControl>
                                <StyledNativeSelect
                                value={this.props.AnalysisSetting.Simulation}
                                onChange={(event) => this.props.updateAnalysisSettingCallback(event, "Simulation")}
                                inputProps={{style: {fontSize: 14, minWidth: "100px"}}}>
                                <option value={100}>100</option>
                                <option value={1000}>1000</option>
                                <option value={2000}>2000</option>
                                <option value={5000}>5000</option>
                                <option value={10000}>10000</option>
                                <option value={20000}>20000</option>
                                <option value={50000}>50000</option>
                                </StyledNativeSelect>
                        </FormControl>
                    </div>
                    <div/><div/>
                </div>

                <Divider className="mt-2 mb-2"/>

                <div className="NMACheckbox"><Checkbox checked ={this.props.AnalysisSetting.ImputedDataset}
                onClick = {(event) => this.props.updateAnalysisSettingCallback(event, "ImputedDataset")} size="small"/>This is an imputed dataset</div>
                <div className="NMACheckbox"><Checkbox checked ={this.props.AnalysisSetting.ImputeData}
                onClick = {(event) => this.props.updateAnalysisSettingCallback(event, "ImputeData")} size="small"/>Impute missing data</div>
                <div className ="NMA-Analysis-Box pl-3" hidden = {!this.props.AnalysisSetting.ImputeData}>
                        <div className="InvisibleBottomBorder pl-4 pt-1">Number of imputation:
                        <StyledTooltip title="The actual number depends on the number of computer cores and may be slightly more than the number specified.">
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                        </div>
                        <div className="pt-1">
                        <TextField
                            type="number"
                            inputProps= {{
                                style: {fontSize: 15}
                            }}
                            className = "Analysis-Setting-TextField"
                            defaultValue = {this.props.AnalysisSetting.M}
                            onChange={(event) => this.props.updateAnalysisSettingCallback(event, "M")}
                        ></TextField>
                        </div>
                </div>
                <div className="NMACheckbox"><Checkbox checked ={this.props.AnalysisSetting.incint}
                onClick = {(event) => this.props.updateAnalysisSettingCallback(event, "incint")} size="small"/>Include exposure-mediator interaction</div>
                <div className="NMACheckbox" hidden={this.props.Variables["Mediator"].length < 2}><Checkbox checked ={this.props.AnalysisSetting.incmmint}
                onClick = {(event) => this.props.updateAnalysisSettingCallback(event, "incmmint")} size="small"/>Include two-way mediator-mediator interaction</div>
            </div>
        )
    }
}