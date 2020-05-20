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

export class MediationVariableSelection extends Component {
    
    genVariableSelectionList = (targetList) => {
        return (
            <VariableSelectionList VariableList = {this.props.Variables[targetList]}
                        checkedList = {this.props.Checked[targetList]}
                        handleToggleCallback = {this.props.handleToggleCallback} 
                        listType = {targetList}
                        CurrentVariableList = {this.props.CurrentVariableList}/>
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
                <div className="Variable-Selection-Box">
                    <div >Variables</div>
                    <div ></div>
                    <div>Outcome</div>
                    <div className="Available-Variable-List-Container" 
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
                    <div>Exposure</div>
                    <div><center>
                        {this.genArrowButton("Exposure", 1)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Exposure")}>
                        {this.genVariableSelectionList("Exposure")}
                    </div>
                    <div></div>
                    <div>Mediator(s)</div>
                    <div><center>
                        {this.genArrowButton("Mediator", 3)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Mediator")}> 
                        {this.genVariableSelectionList("Mediator")}
                    </div>
                    <div></div>
                    <div>Covariate(s)</div>
                    <div><center>
                        {this.genArrowButton("Covariate", 1000000)}
                    </center></div>
                    <div onClick={() => this.props.changeArrowCallback("Covariate")}>
                        {this.genVariableSelectionList("Covariate")}
                    </div>
                </div>
            </div>
        )
    }
}