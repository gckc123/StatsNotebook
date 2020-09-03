import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import {VariableSelectionList} from './VariableSelectionList';
import Button from '@material-ui/core/Button';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import {faSortAlphaDown} from '@fortawesome/free-solid-svg-icons';
import IconButton from '@material-ui/core/IconButton';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';


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

export class DescriptiveVariableSelection extends Component {
    
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
                <div className="Descriptive-Variable-Selection-Box">
                    <div>Variables
                    <StyledTooltip title="Sort alphabetically, from capital to lower case." placement="top"><span className="pl-2">
                        <StyledIconButton size="small" onClick={() => this.props.setSortAvailableCallback()}>
                            <FontAwesomeIcon icon={faSortAlphaDown} size="1x" color={this.props.sortAvailable? "hotpink" : "grey"}/></StyledIconButton>
                        </span></StyledTooltip>
                    </div>
                    <div></div>
                    <div>Target Variables</div>
                    <div className="Descriptive-Available-Variable-List-Container" 
                    onClick={() => this.props.changeArrowCallback("Available")}>
                        {this.genVariableSelectionList("Available")}
                    </div>
                    <div><center>
                        {this.genArrowButton("Targets", 10000)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Targets")}>
                        {this.genVariableSelectionList("Targets")}
                    </div>

                    <div></div>
                    <div>Split by
                    <StyledTooltip title="'Split by' will be ignored if the data is weighted."><span className="pl-2">
                        
                        <FontAwesomeIcon icon={faInfoCircle} size="1x"/>
                    </span></StyledTooltip>
                    </div>
                    <div><center>
                        {this.genArrowButton("SplitBy", 10000)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("SplitBy")}>
                        {this.genVariableSelectionList("SplitBy")}
                    </div>

                    <div></div>
                    <div>Weight
                    <StyledTooltip title="Some analysis settings are not available if the data is weighted."><span className="pl-2">
                        
                        <FontAwesomeIcon icon={faInfoCircle} size="1x"/>
                    </span></StyledTooltip>
                    </div>
                    <div><center>
                        {this.genArrowButton("Weight", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Weight")}>
                        {this.genVariableSelectionList("Weight")}
                    </div>

                    
                </div>
            </div>
        )
    }
}