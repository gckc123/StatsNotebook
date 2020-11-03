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
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons';


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
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&:focus': {
            outline: 'none',
        },
    },
})(IconButton);

export class IPTWVariableSelection extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            currentTime: 0,
        }
    }

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

    genTVVariableSelectionList = (targetList) => {
        return (
            <VariableSelectionList key={targetList} VariableList = {this.props.TimeVarying[this.state.currentTime][targetList]}
                        checkedList = {this.props.TimeVaryingChecked[this.state.currentTime][targetList]}
                        handleToggleCallback = {this.handleToggleTV} 
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

    genTVArrowButton = (targetList, maxElement) => {   
        return (
            <>
            <StyledButton disableRipple hidden={this.props.hideToRight[targetList]}
            onClick = {() => this.props.handleTVToRightCallback(targetList, maxElement, this.state.currentTime)}> 
                <FontAwesomeIcon icon={faArrowRight}/>
            </StyledButton>
            <StyledButton disableRipple hidden={!this.props.hideToRight[targetList]}
            onClick = {() => this.props.handleTVToLeftCallback(targetList, this.state.currentTime)}> 
                <FontAwesomeIcon icon={faTrashAlt}/>
            </StyledButton>
            </>
        )
    }

    addTimeCheck = () => {
        if (this.state.currentTime +1 === this.props.TimeVarying.length) {
            this.props.addTimeCallback(this.state.currentTime)
            this.setState({currentTime: this.state.currentTime +1})
        }
    }

    nextTime = (direction) => {
        if (direction === "next") {
            if (this.state.currentTime +1 !== this.props.TimeVarying.length) {
                this.setState({currentTime: this.state.currentTime + 1})
            }
        }else
        {
            if (this.state.currentTime !== 0) {
                this.setState({currentTime: this.state.currentTime - 1})
            }
        }
    }

    delTimeCheck = () => {
        if (this.props.TimeVarying.length > 1) {
            if (this.state.currentTime + 1 === this.props.TimeVarying.length) {
                /* Last element */
                this.props.delTimeCallback(this.state.currentTime, true)
                this.setState({currentTime: this.state.currentTime - 1})
            }else {
                this.props.delTimeCallback(this.state.currentTime, false)
            }
        }
    }

    handleToggleTV = (varname, from) => {
        this.props.handleToggleTVCallback(varname, from, this.state.currentTime)
    }

    render () {
        
        return (
            <div className="analysis-pane">
                <div className="IPTW-Variable-Selection-Box">
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
                        <StyledIconButton size="small" onClick={() => this.props.openWebpageCallback( this.props.StatsNotebookURL + "/blog/analysis/multiple_imputation/")}>
                            <FontAwesomeIcon icon={faBookReader} size="1x"/></StyledIconButton>
                        </span></StyledTooltip>
                    </div>
                    <div></div>
                    <div className="IPTW-Time-Navigation-Box">
                        <div><StyledIconButton size="small" 
                        onClick = {() => this.nextTime("previous")}
                        ><FontAwesomeIcon icon={faArrowLeft} size="xs"/></StyledIconButton></div>
                        <div><center><b>Time {this.state.currentTime+1}</b></center></div>
                        <div><StyledIconButton size="small" 
                        onClick = {() => this.addTimeCheck()}
                        ><FontAwesomeIcon icon={faPlus} size="xs"/></StyledIconButton></div>
                        <div><StyledIconButton size="small" 
                        onClick = {() => this.delTimeCheck()}
                        ><FontAwesomeIcon icon={faTrashAlt} size="xs"/></StyledIconButton></div>
                        <div><StyledIconButton size="small" 
                        onClick = {() => this.nextTime("next")}
                        ><FontAwesomeIcon icon={faArrowRight} size="xs"/></StyledIconButton></div>

                    </div>


                    <div className="IPTW-Available-Variable-List-Container" 
                    onClick={() => this.props.changeArrowCallback("Available")}>
                        {this.genVariableSelectionList("Available")}
                    </div>                    
                    <div></div>
                    <div>Exposure</div>

                    <div><center>
                        {this.genTVArrowButton("Exposure", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Exposure")}>
                        {this.genTVVariableSelectionList("Exposure")}
                    </div>

                    <div></div>
                    <div>Time Varying Covariates</div>

                    <div><center>
                        {this.genTVArrowButton("TVCovariates", 100000)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("TVCovariates")}>
                        {this.genTVVariableSelectionList("TVCovariates")}
                    </div>

                    <div></div>
                    <div>Baseline Covariates</div>

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