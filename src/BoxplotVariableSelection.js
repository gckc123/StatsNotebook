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

export class BoxplotVariableSelection extends Component {
    
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
                <div className="Boxplot-Variable-Selection-Box">
                    <div >Variables
                    <StyledTooltip title="Variables are sorted alphabetically, from capital to lower letters.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                    <div ></div>
                    <div>Vertical Axis</div>
                    <div className="Boxplot-Available-Variable-List-Container" 
                    onClick={() => this.props.changeArrowCallback("Available")}>
                        {this.genVariableSelectionList("Available")}
                    </div>
                    <div><center>
                        {this.genArrowButton("Vertical", 1000)}
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
                    <div><i>Facet</i></div>
                    <div><center>
                        {this.genArrowButton("Facet", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Facet")}> 
                        {this.genVariableSelectionList("Facet")}
                    </div>

                </div>
            </div>
        )
    }
}