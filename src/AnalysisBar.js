import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
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

export class AnalysisBar extends Component {
    
    render () {
        return (
            <div className="app-bar">
                <StyledButton disableRipple onClick={() => this.props.selectAnalysisPanelCallback("MediationPanel")}>
                <ChangeHistoryIcon/><div className='ml-1'>Mediation</div>
                </StyledButton>
            </div>
        )
    }
}