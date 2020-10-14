import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import {faObjectUngroup} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import "./Notebook.css"

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

export class NotebookBar extends Component {
    
    render() {
        return (
            <div className="notebook-bar">
                <StyledTooltip title="Ctrl-Enter to run the current block."><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={() => this.props.runScriptCallback(true)}> 
                    <FontAwesomeIcon icon={faPlay}/>
                </StyledButton></StyledTooltip>
                <StyledTooltip title={<div>Alt-A to add a block</div>}><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={ () => this.props.addExtraBlkCallback("",false)}>
                    <FontAwesomeIcon icon={faPlus}/>
                </StyledButton></StyledTooltip>
                <StyledTooltip title={<div>Delete</div>}><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={this.props.delBlkCallback}>
                    <FontAwesomeIcon icon={faTrashAlt}/>
                </StyledButton></StyledTooltip>
                <StyledTooltip title={<div>Merge</div>}><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={() => this.props.mergeBlkCallback()}>
                    <FontAwesomeIcon icon={faObjectUngroup}/>
                </StyledButton></StyledTooltip>
                <StyledTooltip title="Alt-Up"><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={()=>{this.props.reorderNotebookBlkCallback("Up")}}>
                    <FontAwesomeIcon icon={faArrowUp}/>
                </StyledButton></StyledTooltip>
                <StyledTooltip title="Alt-Down"><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={()=>{this.props.reorderNotebookBlkCallback("Down")}}>
                    <FontAwesomeIcon icon={faArrowDown}/>
                </StyledButton></StyledTooltip>
            </div>
        )
    }
}