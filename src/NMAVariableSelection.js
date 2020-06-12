import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import {VariableSelectionList} from './VariableSelectionList';
import Button from '@material-ui/core/Button';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';

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

export class NMAVariableSelection extends Component {
    
    genVariableSelectionList = (targetList) => {
        return (
            <VariableSelectionList key={targetList} VariableList = {this.props.Variables[targetList]}
                        checkedList = {this.props.Checked[targetList]}
                        handleToggleCallback = {this.props.handleToggleCallback} 
                        listType = {targetList}
                        CurrentVariableList = {this.props.CurrentVariableList}
                        addExtraBlkCallback = {this.props.addExtraBlkCallback}/>
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
                    <div >Variables</div>
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
                    <div>Effect size</div>
                    <div><center>
                        {this.genArrowButton("EffectSize", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("EffectSize")}> 
                        {this.genVariableSelectionList("EffectSize")}
                    </div>
                    <div></div>
                    <div>Standard Error</div>
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