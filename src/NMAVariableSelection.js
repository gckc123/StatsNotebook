import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import {VariableSelectionList} from './VariableSelectionList';
import Button from '@material-ui/core/Button';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import {faSortAlphaDown} from '@fortawesome/free-solid-svg-icons';
import IconButton from '@material-ui/core/IconButton';
import {faUndoAlt} from '@fortawesome/free-solid-svg-icons';


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

const StyledIconButton = withStyles({
    root: {
        '&:focus': {
            outline: 'none',
        },
    },
})(IconButton);

export class NMAVariableSelection extends Component {
    
    genVariableSelectionList = (targetList) => {
        return (
            <VariableSelectionList key={targetList} VariableList = {this.props.Variables[targetList]}
                        checkedList = {this.props.Checked[targetList]}
                        handleToggleCallback = {this.props.handleToggleCallback} 
                        listType = {targetList}
                        CurrentVariableList = {this.props.CurrentVariableList}
                        addExtraBlkCallback = {this.props.addExtraBlkCallback}
                        needTypeIcon = {true}/>
        )
    }

    genArrowButton = (targetList, maxElement) => {   
        return (
            <>
            <StyledButton disableRipple hidden={this.props.hideToRight[targetList]}
            onClick = {() => this.props.handleToRightCallback(targetList, maxElement)}> 
                <FontAwesomeIcon icon={faArrowRight}/>
            </StyledButton>
            <StyledButton disableRipple hidden={!this.props.hideToRight[targetList]}
            onClick = {() => this.props.handleToLeftCallback(targetList)}> 
                <FontAwesomeIcon icon={faArrowLeft}/>
            </StyledButton>
            </>
        )
    }

    render () {
        return (
            <div className="analysis-pane">
                <div className="NMA-Variable-Selection-Box">
                    <div >Variables
                    <StyledTooltip title="Sort alphabetically, from capital to lower case." placement="top"><span className="pl-2">
                        <StyledIconButton size="small" onClick={() => this.props.setSortAvailableCallback()}>
                            <FontAwesomeIcon icon={faSortAlphaDown} size="1x" color={this.props.sortAvailable? "hotpink" : "grey"}/></StyledIconButton>
                        </span></StyledTooltip>
                    <StyledTooltip title="Reset variable lists." placement="top"><span className="pl-2">
                        <StyledIconButton size="small" onClick={() => this.props.resetVarListCallback()}>
                            <FontAwesomeIcon icon={faUndoAlt} size="1x"/></StyledIconButton>
                        </span></StyledTooltip>
                    </div>
                    <div ></div>
                    <div>Treatment 1</div>
                    <div className="NMA-Available-Variable-List-Container" 
                    onClick={() => this.props.changeArrowCallback("Available")}>
                        {this.genVariableSelectionList("Available")}
                    </div>
                    <div><center>
                        {this.genArrowButton("Treatment1", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Treatment1")}>
                        {this.genVariableSelectionList("Treatment1")}
                    </div>
                    <div></div>
                    <div>Treatment 2</div>
                    <div><center>
                        {this.genArrowButton("Treatment2", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Treatment2")}>
                        {this.genVariableSelectionList("Treatment2")}
                    </div>
                    <div></div>
                    <div>Effect size 
                    <StyledTooltip title={<div>The type of effect size can be specified in analysis setting below. <br/>
                        For Risk/ Odds/ Hazard ratio, the effect size will be log-transformed.<br/>
                        Alternatively, the log-RR/ log-OR/ log-RR can be entered directly.
                        </div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                    <div><center>
                        {this.genArrowButton("EffectSize", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("EffectSize")}> 
                        {this.genVariableSelectionList("EffectSize")}
                    </div>
                    <div></div>
                    <div>Std. Error/ Upper bound of C.I.
                    <StyledTooltip title={<div>If Risk/ Odds/ Hazard ratio is entered above, enter the upper bound of the confidence interval. Specify the level of confidence in analysis setting and the standard error will be computed.<br/>
                    Alternatively, the standard error for log-RR/ log-OR/ log-HR can be entered here.</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                    <div><center>
                        {this.genArrowButton("SE", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("SE")}>
                        {this.genVariableSelectionList("SE")}
                    </div>
                    <div></div>
                    <div>Study Label</div>
                    <div><center>
                        {this.genArrowButton("StudyLab", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("StudyLab")}>
                        {this.genVariableSelectionList("StudyLab")}
                    </div>
                </div>
            </div>
        )
    }
}