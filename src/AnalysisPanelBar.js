import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {faCode} from '@fortawesome/free-solid-svg-icons';
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
    
    pasteAndRun = (script, run) => {
        let currentPanel = ""
        switch (this.props.currentActiveLeftPanel) {
            case "AnalysisPanel":
                currentPanel = this.props.currentActiveAnalysisPanel
                break;
            case "DataVizPanel":
                currentPanel = this.props.currentActiveDataVizPanel
                break;
            default:
                break;
        }
        
        this.props.addExtraBlkCallback(script, run, this.props.currentActiveLeftPanel, currentPanel);
        
    }

    render() {
        return (
            <div>
                <StyledButton disableRipple onClick={() => {this.pasteAndRun(this.props.tentativeScript, true)}}> 
                    <FontAwesomeIcon icon={faPlay}/><div className="ml-1">Code and Run</div>
                </StyledButton>
                <StyledButton disableRipple onClick={ () => {this.pasteAndRun(this.props.tentativeScript, false)}}>
                    <FontAwesomeIcon icon={faCode}/><div className="ml-1">Code</div>
                </StyledButton>
            </div>
        )
    }
}