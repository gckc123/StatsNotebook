import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import "./Notebook.css";
import {VariableSelectionList} from './VariableSelectionList';
import Button from '@material-ui/core/Button';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import "./DataPanelElements.css"; 
import {List} from 'react-virtualized';
import { VariableTypeIcon } from './VariableTypeIcon';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {faShare} from '@fortawesome/free-solid-svg-icons';
import { AnalysisPanelBar } from "./AnalysisPanelBar";

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
})(Button);

const styles = {
    floatingLabelFocusStyle: {
        color: "#FFFFFF"
    }
}

export class ComputePanel extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            currentCursorPosition: 0,
            targetVar: "",
            formula: "",
            function: {
                "Abs (absolute number)": "abs(??)",
                "Exp (exponentiation)": "exp(??)",
                "Is missing?": "is.na(??)",
                "Log (natural log)": "log(??)",
                "Log10 (log with base 10)": "log10(??)",
                "Normal Random Number": "rnorm(nrow(currentDataset))",
                "Row Mean": "rowMeans(cbind(??,??), na.rm = TRUE)",
                "Row Sum": "rowSums(cbind(??,??), na.rm = TRUE)",
                "Square root": "sqrt(??)",
                "Uniform Random Number": "runif(nrow(currentDataset))",
            }
        }
    }

    addVars2Formula = (targetVar) => {

        let regex = /\?\?/
        let currentFormula = this.state.formula
        let updatedFormula = ""
        if (!currentFormula.match(regex)) {
            updatedFormula = this.state.formula.substring(0,this.state.currentCursorPosition+1) + 
            "currentDataset$" + targetVar + this.state.formula.substring(this.state.currentCursorPosition+1)
        }else {
            updatedFormula = currentFormula.replace(regex, "currentDataset$" + targetVar)
        }
        this.setState({formula: updatedFormula})        
    }

    addFun2Formula = (targetFun) => {
        this.setState({formula: this.state.formula + 
            this.state.function[targetFun]})
    }

    _rowRenderer = ({index, key, style}) => {
        return (
            <div key = {key} style = {{...style}} className = "pl-2 ComputeFormulaVarList">
                <div onClick = {() => this.addVars2Formula(this.props.CurrentVariableListSorted[index])}>{this.props.CurrentVariableListSorted[index]}</div>
            </div>
        )
    }

    _rowRendererFun = ({index, key, style}) => {
        return (
            <div key = {key} style = {{...style}} className = "pl-2 ComputeFormulaVarList">
                <div onClick = {() => this.addFun2Formula(Object.keys(this.state.function)[index])}>{Object.keys(this.state.function)[index]}</div>
            </div>
        )
    }

    handleChange(event, target) {       
        if (target === "targetVar") {
            this.setState({targetVar: event.target.value})
        }else if (target === "formula") {
            this.setState({formula: event.target.value})
        }
    }

    addExtraBlkAndClear = (script, run) => {
        this.props.addExtraBlkCallback(script, run)
        this.setState({targetVar: "", formula: ""})
    }

    render () {
        
        return (
            
            <div className="compute-pane">
                <div className="notebook-bar">
                  <AnalysisPanelBar addExtraBlkCallback = {this.addExtraBlkAndClear}
                  runScriptCallback = {this.props.runScriptCallback}
                  tentativeScript = {"currentDataset$" + this.state.targetVar +
                  " <- " + this.state.formula
                  }/>
                </div>
                <div className = "p-2">
                    <div className="compute-pane-target-var-box pt-2">
                        <div className = "InvisibleBottomBorder">Target Variable</div>
                        <div><input className = "ComputeTargetVarInput" value = {this.state.targetVar}
                            onChange={(event) => {this.handleChange(event, "targetVar")}}></input>
                        </div>
                    </div>
                    <div className = "pt-2">Formula</div>
                    <div><textarea className="ComputeFormulaTextarea" value = {this.state.formula}
                        onClick={(event) => this.setState({currentCursorPosition: event.target.selectionStart})}
                        onKeyDown={(event) => this.setState({currentCursorPosition: event.target.selectionStart})}
                        onChange={(event) => {this.handleChange(event, "formula")}}></textarea></div>
                    <div className="compute-pane-var-formula-box">
                        <div>Variable</div>
                        <div className= "pl-2">Function</div>
                        <div>
                            <List
                                style={{border: "1px solid #e8e8e8"}}
                                width={243}
                                height={300}
                                rowCount={this.props.CurrentVariableListSorted.length}
                                rowHeight={25}
                                rowRenderer = {this._rowRenderer}
                            />
                        </div>
                        <div className= "pl-2">
                            <List
                                style={{border: "1px solid #e8e8e8"}}
                                width={243}
                                height={300}
                                rowCount={Object.keys(this.state.function).length}
                                rowHeight={25}
                                rowRenderer = {this._rowRendererFun}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}