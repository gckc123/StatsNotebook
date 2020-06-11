import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import "./Notebook.css"

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
                <StyledButton disableRipple onClick={this.props.runScriptCallback}> 
                    <FontAwesomeIcon icon={faPlay}/><div className="ml-1">Run</div>
                </StyledButton>
                <StyledButton disableRipple onClick={ () => this.props.addExtraBlkCallback("",false)}>
                    <FontAwesomeIcon icon={faPlus}/><div className="ml-1">Add</div>
                </StyledButton>
                <StyledButton disableRipple onClick={this.props.delBlkCallback}>
                    <FontAwesomeIcon icon={faTrashAlt}/><div className="ml-1">Delete</div>
                </StyledButton>
            </div>
        )
    }
}