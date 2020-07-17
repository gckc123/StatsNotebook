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

export class CrosstabVariableSelection extends Component {
    
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
                <div className="Crosstab-Variable-Selection-Box">
                    <div> Variables</div>
                    <div></div>
                    <div>Row Variables</div>
                    <div className="Crosstab-Available-Variable-List-Container" 
                    onClick={() => this.props.changeArrowCallback("Available")}>
                        {this.genVariableSelectionList("Available")}
                    </div>
                    <div><center>
                        {this.genArrowButton("RowVars", 10000)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("RowVars")}>
                        {this.genVariableSelectionList("RowVars")}
                    </div>

                    <div></div>
                    <div>Column Variables</div>
                    <div><center>
                        {this.genArrowButton("ColVars", 10000)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("ColVars")}>
                        {this.genVariableSelectionList("ColVars")}
                    </div>


                    <div></div>
                    <div>Split by</div>
                    <div><center>
                        {this.genArrowButton("SplitBy", 10000)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("SplitBy")}>
                        {this.genVariableSelectionList("SplitBy")}
                    </div>
                    
                </div>
            </div>
        )
    }
}