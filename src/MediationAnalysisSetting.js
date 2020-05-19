import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';


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
                    <tr key={item}>
                        <td className="ModelSelectionVarCol">    
                            {item}
                        </td>
                        <td>
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
                        </td>   
                    </tr>
                )
            })
        )
    }

    render () {
        return (
            <div>
                <table className="mb-3">
                    <tr>
                        <td className="ModelSelectionVarCol">Variables</td>
                        <td>Models</td>
                    </tr>
                    {this.genModelSelection()}
                </table>
                <table>
                    <tr>
                        <td className="ModelSelectionOptionName">Treatment Level:</td>
                        <td className="ModelSelectionOptionInput">INPUT</td>
                        <td className="ModelSelectionOptionName">Control Level:</td>
                        <td className="ModelSelectionOptionInput">INPUT</td>
                    </tr>
                    <tr>
                        <td>Confidence level:</td>
                        <td>0.95</td>
                            <td>Simulation:</td><td>
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
                            </td>
                    </tr>
                    <tr>
                        <td colSpan="4">Impute missing data</td>
                    </tr>    
                </table>         
            </div>
        )
    }
}