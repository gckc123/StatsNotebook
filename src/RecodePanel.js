import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import "./Notebook.css";
import {VariableSelectionList} from './VariableSelectionList';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {faLessThan} from '@fortawesome/free-solid-svg-icons';
import {faLessThanEqual} from '@fortawesome/free-solid-svg-icons';
import {faGreaterThan} from '@fortawesome/free-solid-svg-icons';
import {faGreaterThanEqual} from '@fortawesome/free-solid-svg-icons';
import {faEquals} from '@fortawesome/free-solid-svg-icons';
import {faNotEqual} from '@fortawesome/free-solid-svg-icons';
import {faPowerOff} from '@fortawesome/free-solid-svg-icons';

import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
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

const OrangeIconButton = withStyles({
    root: {
        '&:focus': {
            outline: 'none',
        },
        color: "orange",
    },
})(IconButton);


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

export class RecodePanel extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            currentCursorPosition: 0,
            condition: "",
            newVar: "",
            newValue: "",
            rule: "",
        }
    }

    add2Condition = (target) => {
        
        let updatedCondition = this.state.condition.substring(0,this.state.currentCursorPosition+1) + 
            target + this.state.condition.substring(this.state.currentCursorPosition+1)

        this.setState({condition: updatedCondition, currentCursorPosition: this.state.currentCursorPosition + target.length})

    }

    _rowRenderer = ({index, key, style}) => {
        return (
            <div key = {key} style = {{...style}} className = "pl-2 ComputeFormulaVarList">
                <div onClick = {() => this.add2Condition("currentDataset$"+this.props.CurrentVariableListSorted[index])}>{this.props.CurrentVariableListSorted[index]}</div>
            </div>
        )
    }

    handleChange(event, target) {
        if (target === "newVar") {
            this.setState({newVar: event.target.value}, ()=>{console.log(this.state)})
        }else if (target === "condition") {
            this.setState({condition: event.target.value})
        }else if (target === "rule") {
            this.setState({rule: event.target.value})
        }else if (target === "newValue") {
            this.setState({newValue: event.target.value}, ()=>{console.log(this.state)})
        }
    }

    addRule = () => {
        let ruleString = "currentDataset$" + this.state.newVar + "[" + this.state.condition + "] = " + this.state.newValue + "\n"
        this.setState({rule: this.state.rule + ruleString, newValue: "", condition: ""})
    }

    addExtraBlkAndClear = (script, run) => {
        this.props.addExtraBlkCallback(script, run)
        this.setState({condition: "", newVar: "", newValue: "", rule: "", currentCursorPosition: 0})
    }

    render () {
        
        return (
            
            <div className="compute-pane">
                <div className="notebook-bar">
                  <AnalysisPanelBar addExtraBlkCallback = {this.addExtraBlkAndClear}
                  runScriptCallback = {this.props.runScriptCallback}
                  tentativeScript = {this.state.rule}
                  currentActiveLeftPanel = ""
                  currentActiveDataVizPanel = ""
                  currentActiveAnalysisPanel = ""/>
                </div>
                <div className="compute-pane-target-var-box pt-2">
                        <div className = "InvisibleBottomBorder pl-2">New Variable</div>
                        <div><input className = "RecodeTargetVarInput" onChange={(event) => this.handleChange(event, "newVar")}
                            ></input>
                        </div>
                    </div>
                <div className = "pl-2 pt-2 pr-2 Filter-pane-box">
    
                    <div>Variable</div>
                    <div>New Value <StyledTooltip title={<div>If the new variable is a categorical variable, the new value needs to be wrapped with " " (double quotation mark).
                            <br/>For exapmle, the value "abc" below needs to be wrapped with " ". <br/>
                            currentDataset$variableX == "abc"
                            </div>
                            }>
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                    <div>Operation</div>

                    <div>
                        <List
                            style={{border: "1px solid #e8e8e8"}}
                            width={175}
                            height={250}
                            rowCount={this.props.CurrentVariableListSorted.length}
                            rowHeight={25}
                            rowRenderer = {this._rowRenderer}
                        />
                    </div>

                    <div className="Recode-Pane-Middle-Column">
                        <div><input className="RecodeNewValueInput" value={this.state.newValue} onChange={(event) => this.handleChange(event, "newValue")}></input></div>
                        <div className="pt-1">Condition(s) 
                            <StyledTooltip title={<div>For categorical variables, the value in the conditions needs to be wrapped with " " (double quotation mark).
                            <br/>For exapmle, the value "abc" below needs to be wrapped with " "<br/>
                            currentDataset$variableX == "abc"
                            </div>
                            }>
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                        <div>
                        <textarea className="RecodeConditionTextarea" value = {this.state.condition}
                        onClick={(event) => this.setState({currentCursorPosition: event.target.selectionStart})}
                        onKeyDown={(event) => this.setState({currentCursorPosition: event.target.selectionStart})}
                        onChange={(event) => {this.handleChange(event, "condition")}}></textarea>
                        </div>
                    </div>

                    <div>
                        <div className="Operation-Grid">
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Condition(" < ")}> 
                                    <FontAwesomeIcon icon={faLessThan}/>
                                </StyledButton>
                            </div>                    
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Condition(" > ")}> 
                                    <FontAwesomeIcon icon={faGreaterThan}/>
                                </StyledButton>
                            </div>
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Condition(" <= ")}> 
                                    <FontAwesomeIcon icon={faLessThanEqual}/>
                                </StyledButton>
                            </div>                    
                            <div>
                                <StyledButton disableRipple 
                                    onClick = {() => this.add2Condition(" >= ")}> 
                                    <FontAwesomeIcon icon={faGreaterThanEqual}/>
                                </StyledButton>
                            </div>
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Condition(" == ")}> 
                                    <FontAwesomeIcon icon={faEquals}/>
                                </StyledButton>
                            </div>
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Condition(" != ")}> 
                                    <FontAwesomeIcon icon={faNotEqual}/>
                                </StyledButton>
                            </div>
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Condition(" & ")}> 
                                    <b>AND</b>
                                </StyledButton>
                            </div>
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Condition(" | ")}> 
                                    <b>OR</b>
                                </StyledButton>
                            </div>
                            <div className="Wide-Button-Container" style={{width:"130px"}}>
                                <StyledButton disableRipple fullWidth
                                    onClick = {() => this.add2Condition(" is.na(??) ")}> 
                                    <b>Is missing?</b>
                                </StyledButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pl-2" style={{width: "620px"}}>
                    <StyledButton disableRipple fullWidth onClick={() => this.addRule()}> 
                    <FontAwesomeIcon icon={faArrowDown}/><span className="pl-2 pr-2"> Add rule </span><FontAwesomeIcon icon={faArrowDown}/>
                    </StyledButton>
                </div>
                <div className="pl-2 pr-2 pt-2">
                    <textarea className="RecodeRuleTextarea" value = {this.state.rule}
                        onChange={(event) => {this.handleChange(event, "rule")}}></textarea>
                </div>
            </div>
        )
    }
}