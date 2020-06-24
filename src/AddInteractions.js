import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import {VariableSelectionList} from './VariableSelectionList';
import Button from '@material-ui/core/Button';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons';
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

    genVariableSelectionList = (targetList, needTypeIcon) => {
        return (
            <VariableSelectionList key={targetList} VariableList = {this.props.Variables[targetList]}
                        checkedList = {this.props.Checked[targetList]}
                        handleToggleCallback = {this.props.handleToggleCallback} 
                        listType = {targetList}
                        CurrentVariableList = {this.props.CurrentVariableList}
                        addExtraBlkCallback = {this.props.addExtraBlkCallback}
                        needTypeIcon = {needTypeIcon}/>
        )
    }

    genInteractionArrowButton = () => {
        return (
            <>
            <StyledButton disableRipple hidden={this.state.arrowDelBtn != "arrow"}
            onClick = {() => console.log("right")}> 
                <FontAwesomeIcon icon={faArrowRight}/>
            </StyledButton>
            <StyledButton disableRipple hidden={this.state.arrowDelBtn != "del"}
            onClick = {() => console.log("Del")}> 
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
                    <div>Interaction terms</div>
                    <div onClick={() => this.setState({arrowDelBtn: "arrow"})}>
                        {this.genVariableSelectionList("Covariates", true)}
                    </div>
                    <div><center>
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </center></div>
                    <div onClick={() => this.setState({arrowDelBtn: "del"})}>
                        {this.genVariableSelectionList("Interaction", false)}
                    </div>
                </div>
            </div>
        )
    }
}