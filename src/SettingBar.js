import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {faFile} from '@fortawesome/free-regular-svg-icons';
import {faFolderOpen} from '@fortawesome/free-regular-svg-icons';
import {faSave} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import "./App.css";

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

export class SettingBar extends Component {
    
    render () {
        return (
            <div className="app-bar">
                <StyledButton disableRipple>
                    <FontAwesomeIcon icon={faFile}/><div className='ml-1'>New</div>
                </StyledButton>
                <StyledButton disableRipple onClick={this.props.openFileCallback}>
                    <FontAwesomeIcon icon={faFolderOpen} /><div className='ml-1'>Open</div>
                </StyledButton>
                <StyledButton disableRipple>
                    <FontAwesomeIcon icon={faSave} /><div className='ml-1'>Save</div>
                </StyledButton>
            </div>
        )
    }
}