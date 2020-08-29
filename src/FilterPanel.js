import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import "./Notebook.css";

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {faLessThan} from '@fortawesome/free-solid-svg-icons';
import {faLessThanEqual} from '@fortawesome/free-solid-svg-icons';
import {faGreaterThan} from '@fortawesome/free-solid-svg-icons';
import {faGreaterThanEqual} from '@fortawesome/free-solid-svg-icons';
import {faEquals} from '@fortawesome/free-solid-svg-icons';
import {faNotEqual} from '@fortawesome/free-solid-svg-icons';
import {faPowerOff} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import "./DataPanelElements.css"; 
import {List} from 'react-virtualized';
import {faSortAlphaDown} from '@fortawesome/free-solid-svg-icons';
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

const StyledIconButton = withStyles({
    root: {
        '&:focus': {
            outline: 'none',
        },
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

export class FilterPanel extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            currentCursorPosition: 0,
            filter: "",
            sortAvailable: 0,
        }
    }

    add2Filter = (target) => {
        
        let updatedFilter = this.state.filter.substring(0,this.state.currentCursorPosition+1) + 
            target + this.state.filter.substring(this.state.currentCursorPosition+1)

        this.setState({filter: updatedFilter, currentCursorPosition: this.state.currentCursorPosition + target.length})

    }

    _rowRenderer = ({index, key, style}) => {
        return (
            <div key = {key} style = {{...style}} className = "pl-2 ComputeFormulaVarList">
                <div onClick = {() => this.add2Filter(this.props.CurrentVariableList[this.state.sortAvailable][index])}>{this.props.CurrentVariableList[this.state.sortAvailable][index]}</div>
            </div>
        )
    }

    handleChange(event) {       
        this.setState({filter: event.target.value})
    }

    setSortAvailable = () => {
        this.setState({sortAvailable: (this.state.sortAvailable === 0 ? 1 : 0)})
    }

    render () {
        
        return (
            
            <div className="compute-pane">
                <div className="notebook-bar">
                  <AnalysisPanelBar addExtraBlkCallback = {this.props.addExtraBlkCallback}
                  runScriptCallback = {this.props.runScriptCallback}
                  tentativeScript = {"if (!exists(\"originalDataset\")) {\n  originalDataset <- currentDataset\n}\ncurrentDataset <- originalDataset %>%\n  " + 
                    "filter(" + this.state.filter + ")"
                  }
                  currentActiveLeftPanel = ""
                  currentActiveDataVizPanel = ""
                  currentActiveAnalysisPanel = ""/>
                </div>
                <div className = "p-2 Filter-pane-box">
    
                    <div className = "pt-2">Variable
                    <StyledTooltip title="Sort alphabetically, from capital to lower case." placement="top"><span className="pl-2">
                        <StyledIconButton size="small" onClick={() => this.setSortAvailable()}>
                            <FontAwesomeIcon icon={faSortAlphaDown} size="1x" color={this.state.sortAvailable === 1? "hotpink" : "grey"}/></StyledIconButton>
                        </span></StyledTooltip>
                    </div>
                    <div className = "pt-2">Filter<StyledTooltip title={<div>For values of a categorical variable, the value needs to be wrapped by " "
                            <br/>For exapmle, the value "abc" below needs to be wrapped with " ".<br/>
                            currentDataset$variableX == "abc"
                            </div>
                            }>
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                    <div className = "pt-2">Operation</div>

                    <div>
                        <List
                            style={{border: "1px solid #e8e8e8"}}
                            width={180}
                            height={400}
                            rowCount={this.props.CurrentVariableList[0].length}
                            rowHeight={25}
                            rowRenderer = {this._rowRenderer}
                        />
                    </div>

                    <div><textarea className="FilterTextarea" value = {this.state.filter}
                        onClick={(event) => this.setState({currentCursorPosition: event.target.selectionStart})}
                        onKeyDown={(event) => this.setState({currentCursorPosition: event.target.selectionStart})}
                        onChange={(event) => {this.handleChange(event)}}></textarea></div>

                    <div>
                        <div className="Operation-Grid">
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Filter(" < ")}> 
                                    <FontAwesomeIcon icon={faLessThan}/>
                                </StyledButton>
                            </div>                    
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Filter(" > ")}> 
                                    <FontAwesomeIcon icon={faGreaterThan}/>
                                </StyledButton>
                            </div>
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Filter(" <= ")}> 
                                    <FontAwesomeIcon icon={faLessThanEqual}/>
                                </StyledButton>
                            </div>                    
                            <div>
                                <StyledButton disableRipple 
                                    onClick = {() => this.add2Filter(" >= ")}> 
                                    <FontAwesomeIcon icon={faGreaterThanEqual}/>
                                </StyledButton>
                            </div>
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Filter(" == ")}> 
                                    <FontAwesomeIcon icon={faEquals}/>
                                </StyledButton>
                            </div>
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Filter(" != ")}> 
                                    <FontAwesomeIcon icon={faNotEqual}/>
                                </StyledButton>
                            </div>
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Filter(" & ")}> 
                                    <b>AND</b>
                                </StyledButton>
                            </div>
                            <div>
                                <StyledButton disableRipple
                                    onClick = {() => this.add2Filter(" | ")}> 
                                    <b>OR</b>
                                </StyledButton>
                            </div>
                            <div className="Wide-Button-Container" style={{width:"130px"}}>
                                <StyledButton disableRipple fullWidth
                                    onClick = {() => this.add2Filter(" is.na(??) ")}> 
                                    <b>Is missing?</b>
                                </StyledButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pl-1">
                    <OrangeIconButton size="small"
                        onClick={() => {this.props.addExtraBlkCallback("if (exists(\"originalDataset\")) {\n  currentDataset <- originalDataset\n}", true)}}>
                        <FontAwesomeIcon icon={faPowerOff}  />
                    </OrangeIconButton> Turn Off Filter
                </div>
            </div>
        )
    }
}