import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import {VariableSelectionList} from './VariableSelectionList';
import Button from '@material-ui/core/Button';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons';
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

export class AddInteraction extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            arrowDelBtn: "arrow"
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

    genInteractionArrowButton = () => {
        return (
            <>
            <StyledButton disableRipple hidden={this.state.arrowDelBtn !== "arrow"}
            onClick = {() => this.props.addInteractionTermCallback()}> 
                <FontAwesomeIcon icon={faArrowRight}/>
            </StyledButton>
            <StyledButton disableRipple hidden={this.state.arrowDelBtn !== "del"}
            onClick = {() => this.props.delInteractionTermCallback()}> 
                <FontAwesomeIcon icon={faTrashAlt}/>
            </StyledButton>
            </>
        )
    }

    render () {
        return (
            
            <div className="analysis-pane">
                <div className="AddInteraction-Variable-Selection-Box">
                    <div>Covariates</div>
                    <div></div>
                    <div>Interaction terms<StyledTooltip title="When a higer order interaction is added, all relevant lower order interactions will be included in the model.">
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                    <div onClick={() => this.setState({arrowDelBtn: "arrow"})}>
                        {this.genVariableSelectionList("Covariates","CovariatesIntSelection", true)}
                    </div>
                    <div><center>
                        {this.genInteractionArrowButton()}
                    </center></div>
                    <div onClick={() => this.setState({arrowDelBtn: "del"})}>
                        <VariableSelectionList VariableList = {this.props.interaction}
                        checkedList = {this.props.checkedInteraction}
                        handleToggleCallback = {this.props.handleToggleInteractionCallback} 
                        listType = {"Interaction"}
                        CurrentVariableList = {null}
                        addExtraBlkCallback = {null}
                        needTypeIcon = {false}/>
                        
                    </div>
                </div>
            </div>
        )
    }
}