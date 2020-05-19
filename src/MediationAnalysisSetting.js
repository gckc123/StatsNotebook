import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';


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
                    <>
                        <div className="ModelSelectionVarCol">    
                            {item}
                        </div>
                        <div>
                            <FormControl>
                                <StyledNativeSelect                                
                                defaultValue={"regression"}
                                inputProps={{style: {fontSize: 14}}}
                                variant="filled">
                                <option value={"regression"}>Regression (Continuous variable)</option>
                                <option value={"logistic regression"}>Logistic regression (Dichotomized variable)</option>
                                <option value={"poisson regression"}>Poisson regression (Count variable)</option>
                                </StyledNativeSelect>
                            </FormControl>
                        </div>   
                    </>
                )
            })
        )
    }

    render () {
        return (
            <div>
                <div className="ModelSelectionBox">
                    <div>Variables</div>
                    <div>Models</div>
                    
                    {this.genModelSelection()}
                </div>
                
                <Divider className="mt-2 mb-2"/>
                
                <div className = "ModelSelectionOptionSet">
                    <div className="InvisibleBottomBorder">Treatment level:</div>
                    <div><input className="ModelSelectionInput"/></div>
                    <div className="InvisibleBottomBorder">Control level:</div>
                    <div><input className="ModelSelectionInput"/></div>
                    <div>Confidence Intervel:</div>
                    <div><input className="ModelSelectionInput"/>%</div>
                    <div>Simulation:</div>
                    <div>
                        <FormControl>
                                <StyledNativeSelect
                                defaultValue={1000}
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
                </div>

                <Divider className="mt-2 mb-2"/>

                <table>
                    
                    <tr>
                        <td colSpan="4" className="testing1"><Checkbox className="testing1" size="small"/>Impute missing data</td>
                    </tr>    
                </table>         
            </div>
        )
    }
}