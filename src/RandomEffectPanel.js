import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import {VariableSelectionList} from './VariableSelectionList';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import {faArrowAltCircleLeft} from '@fortawesome/free-regular-svg-icons';
import {faArrowAltCircleRight} from '@fortawesome/free-regular-svg-icons';

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

export class RandomEffectPanel extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            arrowDelBtn: "arrow",
            currentREVar: ""
        }
    }

    componentDidUpdate() {
        if (this.props.Variables.RandomEffect.length > 0 && 
            this.props.Variables.RandomEffect.findIndex( (item) => item === this.state.currentREVar) === -1)  {
                this.setState({currentREVar: this.props.Variables.RandomEffect[0]})
        }else if (this.props.Variables.RandomEffect.length === 0 && this.state.currentREVar !== "") {
            this.setState({currentREVar: ""})
        }
    }

    genVariableSelectionList = (targetVarList, targetCheckedList, needTypeIcon) => {
        return (
            <VariableSelectionList key={targetVarList} VariableList = {this.props.Variables[targetVarList]}
                        checkedList = {this.props.Checked[targetCheckedList]}
                        handleToggleCallback = {this.props.handleToggleCallback} 
                        listType = {targetCheckedList}
                        CurrentVariableList = {this.props.CurrentVariableList}
                        addExtraBlkCallback = {this.props.addExtraBlkCallback}
                        needTypeIcon = {needTypeIcon}/>
        )
    }

    genREArrowButton = () => {
        return (
            <>
            <StyledButton disableRipple hidden={this.state.arrowDelBtn !== "arrow"}
            onClick = {() => this.props.addRandomSlopesCallback(this.state.currentREVar)}> 
                <FontAwesomeIcon icon={faArrowRight}/>
            </StyledButton>
            <StyledButton disableRipple hidden={this.state.arrowDelBtn !== "del"}
            onClick = {() => this.props.delRandomSlopesCallback(this.state.currentREVar)}> 
                <FontAwesomeIcon icon={faTrashAlt}/>
            </StyledButton>
            </>
        )
    }

    nextRandomEffect = (direction) => {
        let currentREVarIndex = this.props.Variables.RandomEffect.findIndex((item) => item === this.state.currentREVar)        
        if (direction === "next" && currentREVarIndex !== (this.props.Variables.RandomEffect.length - 1)) {
            this.setState({currentREVar: this.props.Variables.RandomEffect[currentREVarIndex+1]})
        }else if (direction === "previous" && currentREVarIndex !== 0) {
            this.setState({currentREVar: this.props.Variables.RandomEffect[currentREVarIndex-1]})
        }
    }

    render () {
        return (
            <div className="analysis-pane" hidden={!(this.state.currentREVar in this.props.RandomSlopes)}>
                <div className="Random-Variable-Selection-Box">
                    <div><StyledIconButton size="small" 
                        onClick={()=>this.nextRandomEffect("previous")}><FontAwesomeIcon icon={faArrowLeft} size="xs"/></StyledIconButton></div>
                    <div className="pl-1 pr-1 Random-Variable-Label"><b>{this.state.currentREVar}</b></div>
                    <div><StyledIconButton size="small"
                        onClick={()=>this.nextRandomEffect("next")}><FontAwesomeIcon icon={faArrowRight} size="xs"/></StyledIconButton></div>
                    
                </div>
                <div className="AddInteraction-Variable-Selection-Box">
                    <div>Covariates</div>
                    <div></div>
                    <div>Random Slope</div>
                    <div onClick={() => this.setState({arrowDelBtn: "arrow"})}>
                        <VariableSelectionList VariableList = {this.state.currentREVar in this.props.RandomSlopes ? this.props.Variables["Covariates"] : []}
                        checkedList = {this.state.currentREVar in this.props.RandomSlopes ? this.props.Checked["CovariatesRESelection"] : []}
                        handleToggleCallback = {this.props.handleToggleCallback} 
                        listType = {"CovariatesRESelection"}
                        CurrentVariableList = {this.props.CurrentVariableList}
                        addExtraBlkCallback = {this.props.addExtraBlkCallback}
                        needTypeIcon = {true}/>                        
                    </div>
                    <div><center>
                        {this.genREArrowButton()}
                    </center></div>
                    <div onClick={() => this.setState({arrowDelBtn: "del"})}>
                        {
                            <VariableSelectionList VariableList = {this.state.currentREVar !== "" && this.state.currentREVar in this.props.RandomSlopes ? this.props.RandomSlopes[this.state.currentREVar]: []}
                            checkedList = {this.state.currentREVar !== "" && this.state.currentREVar in this.props.RandomSlopes ? this.props.CheckedRandomSlopes[this.state.currentREVar] : []}
                            handleToggleCallback = {this.props.handleToggleRECallback} 
                            listType = {this.state.currentREVar}
                            CurrentVariableList = {null}
                            addExtraBlkCallback = {null}
                            needTypeIcon = {false}/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}