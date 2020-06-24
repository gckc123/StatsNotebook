import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {faCalculator} from '@fortawesome/free-solid-svg-icons';
import {faFilter} from '@fortawesome/free-solid-svg-icons';
import {faExchangeAlt} from '@fortawesome/free-solid-svg-icons';
import {faBook} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTable} from '@fortawesome/free-solid-svg-icons';
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

export class DataBar extends Component {
    
    render () {
        return (
            <div className="app-bar" >
                <StyledButton disableRipple onClick={() => this.props.selectDataPanelCallback("DataPanel")}>
                    <FontAwesomeIcon icon={faTable} /><div className='ml-1'>Data</div>
                </StyledButton>
                <StyledButton disableRipple onClick={() => this.props.selectDataPanelCallback("VarsReferencePanel")}>
                    <FontAwesomeIcon icon={faBook}/><div className='ml-1'>Reference</div>
                </StyledButton>
                <StyledButton disableRipple disabled>
                    <FontAwesomeIcon icon={faCalculator} /><div className='ml-1'>Compute</div>
                </StyledButton>
                <StyledButton disableRipple disabled>
                    <FontAwesomeIcon icon={faFilter} /><div className='ml-1'>Filter</div>
                </StyledButton>
                <StyledButton disableRipple disabled>
                    <FontAwesomeIcon icon={faExchangeAlt} /><div className='ml-1'>Recode</div>
                </StyledButton>

            </div>
        )
    }
}