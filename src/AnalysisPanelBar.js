import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {faShare} from '@fortawesome/free-solid-svg-icons';
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

export class AnalysisPanelBar extends Component {
    
    render() {
        return (
            <div>
                <StyledButton disableRipple onClick={() => {this.props.addExtraBlkCallback(this.props.tentativeScript);
                this.props.runScriptCallback()}}> 
                    <FontAwesomeIcon icon={faPlay}/><div className="ml-1">Paste and Run</div>
                </StyledButton>
                <StyledButton disableRipple onClick={ () => {this.props.addExtraBlkCallback(this.props.tentativeScript)}}>
                    <FontAwesomeIcon icon={faShare}/><div className="ml-1">Paste</div>
                </StyledButton>
            </div>
        )
    }
}