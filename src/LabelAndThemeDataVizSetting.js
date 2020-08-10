import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Checkbox from '@material-ui/core/Checkbox';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField'

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
})(IconButton);

const StyledNativeSelect = withStyles({
    root: {
        '&:focus': {
            outline: 'none',
            background: 'white',
        },
    },
    select: {
        paddingLeft: '5px',
        "&:focus": {
            border: "0px",
            outline: "0px",
        }
    }
  })(NativeSelect);


export class LabelAndThemeDataVizSetting extends Component {

    render () {
        return (
            <div>
                
                <div className="pb-2">
                    <div>Title</div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Font Size</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}></input></div>
                    </div>
                </div>

                <div className="pb-2">
                    <div>Horizontal Axis</div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Font Size</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}></input></div>
                    </div>
                </div>

                <div className="pb-2">
                    <div>Vertical Axis</div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Font Size</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}></input></div>
                    </div>
                </div>                  

                <div className="pb-2">
                    <div>Legends</div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Color Fill Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Color Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Shape Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Size Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Font Size</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Legend position</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}></input></div>
                    </div>
                </div>

                <div className="pb-2">
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Theme</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Color Palette</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}></input></div>
                    </div>
                    
                </div>

            </div>
        )
    }
}