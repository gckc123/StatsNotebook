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
import {faBookReader} from '@fortawesome/free-solid-svg-icons';

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

export class ITSAVariableSelection extends Component {
    
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
                <div className="ITSA-Variable-Selection-Box">
                    <div> Variables
                    <StyledTooltip title="Sort alphabetically, from capital to lower case." placement="top"><span className="pl-2">
                        <StyledIconButton size="small" onClick={() => this.props.setSortAvailableCallback()}>
                            <FontAwesomeIcon icon={faSortAlphaDown} size="1x" color={this.props.sortAvailable? "hotpink" : "grey"}/></StyledIconButton>
                        </span></StyledTooltip>
                    <StyledTooltip title="Reset variable lists." placement="top"><span className="pl-2">
                        <StyledIconButton size="small" onClick={() => this.props.resetVarListCallback()}>
                            <FontAwesomeIcon icon={faUndoAlt} size="1x"/></StyledIconButton>
                        </span></StyledTooltip>
                    <StyledTooltip title="see tutorial at StatsNotebook.io" placement="top"><span className="pl-2">
                        <StyledIconButton size="small" onClick={() => this.props.openWebpageCallback( this.props.StatsNotebookURL + "/blog/analysis/itsa/")}>
                            <FontAwesomeIcon icon={faBookReader} size="1x"/></StyledIconButton>
                        </span></StyledTooltip>
                    </div>
                    <div></div>
                    <div>Outcome</div>
                    <div className="ITSA-Available-Variable-List-Container" 
                    onClick={() => this.props.changeArrowCallback("Available")}>
                        {this.genVariableSelectionList("Available")}
                    </div>
                    <div><center>
                        {this.genArrowButton("Outcome", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Outcome")}>
                        {this.genVariableSelectionList("Outcome")}
                    </div>

                    <div></div>
                    <div>Time</div>
                    <div><center>
                        {this.genArrowButton("Time", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Time")}>
                        {this.genVariableSelectionList("Time")}
                    </div>

                    <div></div>
                    <div>Intervention<StyledTooltip title="The variable needs to be coded as Categorical">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                    <div><center>
                        {this.genArrowButton("Intervention", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Intervention")}>
                        {this.genVariableSelectionList("Intervention")}
                    </div>

                    <div></div>
                    <div>ControlIntervention<StyledTooltip title="The variable needs to be coded as Categorical">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                    <div><center>
                        {this.genArrowButton("Control", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Control")}>
                        {this.genVariableSelectionList("Control")}
                    </div>

                    <div></div>
                    <div>Covariates</div>
                    <div><center>
                        {this.genArrowButton("Covariates", 100000)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Covariates")}>
                        {this.genVariableSelectionList("Covariates")}
                    </div>
                </div>
            </div>
        )
    }
}