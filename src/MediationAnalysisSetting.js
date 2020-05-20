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
  

export class MediationAnalysisSetting extends Component {
    
    constructor(props) {
        super(props)
        this.state = {

                Models: {},
                Treat_lv: 1,
                Control_lv: 0,
                Conf_lv: 0.95,
                Simulation: 1000,
                Complete_analysis: true,

        }
    }

    updateModelSelection = (event) => {
        //this.setState({Models:{...this.state.Models,[event.target.name]:event.target.value}})
        //console.log(Models)
    }

    updateTreatmentLv = (event) => {
        this.setState({Treat_lv: event.target.value})
    }

    updateControlLv = (event) => {
        this.setState({Control_lv: event.target.value})
    }

    updateSimulation = (event) => {
        this.setState({Simulation: event.target.value})
        //console.log(event.target.value)
    }

    updateCI = (event) => {
        this.setState({Conf_lv: event.target.value/100})
    }

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
                                defaultValue={""}
                                inputProps={{style: {fontSize: 14}}}
                                variant="filled"
                                name={item}
                                onChange={this.updateModelSelection}>
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
                    onChange={this.updateTreatmentLv} value={this.state.Treat_lv}/></div>
                    <div className="InvisibleBottomBorder">Control level:</div>
                    <div><input className="ModelSelectionInput" 
                    onChange={this.updateControlLv} value={this.state.Control_lv}/></div>
                    <div>Confidence Intervel:</div>
                    <div><input className="ModelSelectionInput"
                    onChange={this.updateCI} value={this.state.Conf_lv*100}/>%</div>
                    <div>Simulation:</div>
                    <div>
                        <FormControl>
                                <StyledNativeSelect
                                defaultValue={this.state.Simulation}
                                onChange={this.updateSimulation}
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

                <Checkbox className="testing1" size="small"/>Impute missing data
                    
            </div>
        )
    }
}