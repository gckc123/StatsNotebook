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

export class ScatterplotVariableSelection extends Component {
    
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
                <div className="Scatterplot-Variable-Selection-Box">
                    <div >Variables
                    <StyledTooltip title="Sort alphabetically, from capital to lower case." placement="top"><span className="pl-2">
                        <StyledIconButton size="small" onClick={() => this.props.setSortAvailableCallback()}>
                            <FontAwesomeIcon icon={faSortAlphaDown} size="1x" color={this.props.sortAvailable? "hotpink" : "grey"}/></StyledIconButton>
                        </span></StyledTooltip>
                    <StyledTooltip title="Reset variable lists." placement="top"><span className="pl-2">
                        <StyledIconButton size="small" onClick={() => this.props.resetVarListCallback()}>
                            <FontAwesomeIcon icon={faUndoAlt} size="1x"/></StyledIconButton>
                        </span></StyledTooltip>
                    
                    <StyledTooltip title="see tutorial at StatsNotebook.io" placement="top"><span className="pl-2">
                        <StyledIconButton size="small" onClick={() => this.props.openWebpageCallback( this.props.StatsNotebookURL + "/blog/dataviz/")}>
                            <FontAwesomeIcon icon={faBookReader} size="1x"/></StyledIconButton>
                        </span></StyledTooltip>

                    </div>
                    <div ></div>
                    <div>Vertical Axis</div>
                    <div className="Scatterplot-Available-Variable-List-Container" 
                    onClick={() => this.props.changeArrowCallback("Available")}>
                        {this.genVariableSelectionList("Available")}
                    </div>
                    <div><center>
                        {this.genArrowButton("Vertical", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Vertical")}>
                        {this.genVariableSelectionList("Vertical")}
                    </div>

                    <div></div>
                    <div>Horizontal Axis</div>
                    <div><center>
                        {this.genArrowButton("Horizontal", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Horizontal")}>
                        {this.genVariableSelectionList("Horizontal")}
                    </div>

                    <div></div>
                    <div>Split by</div>
                    <div></div>
                    <div><i>Fill color</i></div>

                    <div><center>
                        {this.genArrowButton("FillColor", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("FillColor")}>
                        {this.genVariableSelectionList("FillColor")}
                    </div>

                    <div></div>
                    <div><i>Point shape</i></div>
                    <div><center>
                        {this.genArrowButton("Shape", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Shape")}> 
                        {this.genVariableSelectionList("Shape")}
                    </div>

                    <div></div>
                    <div><i>Size</i></div>
                    <div><center>
                        {this.genArrowButton("Size", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Size")}> 
                        {this.genVariableSelectionList("Size")}
                    </div>

                    <div></div>
                    <div><i>Facet</i></div>
                    <div><center>
                        {this.genArrowButton("Facet", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Facet")}> 
                        {this.genVariableSelectionList("Facet")}
                    </div>

                    <div></div>
                    <div><i>Frame</i></div>
                    <div><center>
                        {this.genArrowButton("Frame", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Frame")}> 
                        {this.genVariableSelectionList("Frame")}
                    </div>

                </div>
            </div>
        )
    }
}