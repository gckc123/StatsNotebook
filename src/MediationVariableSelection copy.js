import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import {VariableSelectionList} from './VariableSelectionList';
import Button from '@material-ui/core/Button';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';

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
})(Button);

export class MediationVariableSelection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Variables: {
                Available: [],
                Outcome: [],
                Exposure: [],
                Mediator: [],
                Covariate: []
            },
            Checked: {
                Available: [],
                Outcome: [],
                Exposure: [],
                Mediator: [],
                Covariate: []
            },
            hideToRight: {
                Outcome: false,
                Exposure: false,
                Mediator: false,
                Covariate: false
            },
        }
    }
    
    componentDidUpdate() {
        console.log("from mediation variable selection")
        let VariablesObj = {...this.state.Variables}
        let CheckedObj = {...this.state.Checked}
        let CurrentVariableList = this.props.CurrentVariableList
        let allVarsInCurrentList = []
        for (let key in this.state.Variables) {   
            allVarsInCurrentList = allVarsInCurrentList.concat(this.state.Variables[key])
        }

        if (JSON.stringify(CurrentVariableList.sort()) !== JSON.stringify(allVarsInCurrentList.sort())) {
            for (let key in this.state.Variables) {
                VariablesObj[key] = this.intersection(VariablesObj[key], CurrentVariableList)
                CheckedObj[key] = this.intersection(CheckedObj[key],VariablesObj[key])
            }
    
            let addToAvailable = this.not(CurrentVariableList, allVarsInCurrentList)
            VariablesObj["Available"] = VariablesObj["Available"].concat(addToAvailable)
    
            console.log("After update")
            console.log(VariablesObj)
    
            this.setState({Variables:{...VariablesObj}})
            this.setState({Checked: {...CheckedObj}})
        }
      }

    handleToggle = (varname, from) => {
        let CheckedObj = {...this.state.Checked}
        let currentIndex = CheckedObj[from].indexOf(varname);
        if (currentIndex === -1) {
            CheckedObj[from].push(varname)
        }else {
            CheckedObj[from].splice(currentIndex, 1)
        }

        for (let key in CheckedObj) {
            if (key !== from) {
                CheckedObj[key] = [];
            }
        }        
        this.setState({Checked: {...CheckedObj}})
    }

    changeArrow = (target) => {
        let hideToRightObj = {...this.state.hideToRight}
        if (target !== "Available") {
            hideToRightObj[target] = true
        }else {
            for (let key in hideToRightObj) {
                hideToRightObj[key] = false
            }
        }
        this.setState({hideToRight:{...hideToRightObj}})
    }

    genVariableSelectionList = (targetList) => {
        return (
            <VariableSelectionList VariableList = {this.state.Variables[targetList]}
                        checkedList = {this.state.Checked[targetList]}
                        handleToggleCallback = {this.handleToggle} 
                        listType = {targetList}/>
        )
    }

    genArrowButton = (targetList, maxElement) => {
        return (
            <>
            <StyledButton disableRipple hidden={this.state.hideToRight[targetList]}
            onClick = {() => this.handleToRight(targetList, maxElement)}> 
                <FontAwesomeIcon icon={faArrowRight}/>
            </StyledButton>
            <StyledButton disableRipple hidden={!this.state.hideToRight[targetList]}
            onClick = {() => this.handleToLeft(targetList)}> 
                <FontAwesomeIcon icon={faArrowLeft}/>
            </StyledButton>
            </>
        )
    }

    intersection = (array1, array2) => {
        return array1.filter((item) => array2.indexOf(item) !== -1)
    }

    not = (array1, array2) => {
        return array1.filter((item) => array2.indexOf(item) === -1)
    }

    handleToRight = (target, maxElement) => {
        let VariablesObj = {...this.state.Variables}
        let CheckedObj = {...this.state.Checked}
        if (VariablesObj[target].length + CheckedObj["Available"].length <= maxElement) {
            VariablesObj["Available"] = this.not(VariablesObj["Available"],CheckedObj["Available"])
            VariablesObj[target] = VariablesObj[target].concat(CheckedObj["Available"])
            CheckedObj["Available"] = []
            this.setState({Variables: {...VariablesObj}},
                () => this.setState({Checked: {...CheckedObj}}))
        }else{
            if (CheckedObj["Available"].length > 0) {
                alert("Only "+ maxElement + " " + target + " variable(s) can be specified.")
            }
        }
    }

    handleToLeft = (from) => {
        let VariablesObj = {...this.state.Variables}
        let CheckedObj = {...this.state.Checked}
        VariablesObj[from] = this.not(VariablesObj[from], CheckedObj[from])
        VariablesObj["Available"] = VariablesObj["Available"].concat(CheckedObj[from])
        CheckedObj[from] = []
        this.setState({Variables: {...VariablesObj}},
            () => this.setState({Checked: {...CheckedObj}}))
    }

    buildScript = () => {
        console.log("Building Script!")
    }

    render () {
        return (
            <div className="analysis-pane">
                <div className="Variable-Selection-Box">
                    <div >Variables</div>
                    <div ></div>
                    <div>Outcome</div>
                    <div className="Available-Variable-List-Container" onClick={() => this.changeArrow("Available")}>
                        {this.genVariableSelectionList("Available")}
                    </div>
                    <div><center>
                        {this.genArrowButton("Outcome", 1)}
                    </center></div>
                    <div onClick={() => this.changeArrow("Outcome")}>
                        {this.genVariableSelectionList("Outcome")}
                    </div>
                    <div></div>
                    <div>Exposure</div>
                    <div><center>
                        {this.genArrowButton("Exposure", 1)}
                    </center></div>
                    <div onClick={() => this.changeArrow("Exposure")}>
                        {this.genVariableSelectionList("Exposure")}
                    </div>
                    <div></div>
                    <div>Mediator(s)</div>
                    <div><center>
                        {this.genArrowButton("Mediator", 3)}
                    </center></div>
                    <div onClick={() => this.changeArrow("Mediator")}> 
                        {this.genVariableSelectionList("Mediator")}
                    </div>
                    <div></div>
                    <div>Covariate(s)</div>
                    <div><center>
                        {this.genArrowButton("Covariate", 1000000)}
                    </center></div>
                    <div onClick={() => this.changeArrow("Covariate")}>
                        {this.genVariableSelectionList("Covariate")}
                    </div>
                </div>
            </div>
        );
    }
}