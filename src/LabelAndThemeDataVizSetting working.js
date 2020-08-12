import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Checkbox from '@material-ui/core/Checkbox';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {faListUl} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);

  const StyledIconButton = withStyles({
    root: {
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&:focus': {
            outline: 'none',
        },
    },
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

    constructor(props) {
        super(props)
        this.state = {
            basicMode: true,
            showDialog: false,
        }
    }

    switchMode = () => {
        this.setState({basicMode: !this.state.basicMode})
    }

    handleOpen = () => {
        this.setState({showDialog: true})
    }

    handleClose = () => {
        this.setState({showDialog: false})
    }

    render () {
        return (
            <div>
                <div className = "pb-2"><span><StyledIconButton size="small"><FormatListBulletedIcon fontSize="small" onClick = {() => this.switchMode()}/></StyledIconButton></span><span className="pl=2">
                    Switch to {(this.state.basicMode ? "Advanced": "Basic")} mode</span></div>
                <div className="pb-2">
                    <div><b>Title</b></div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "title")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "title")}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                        <div className = "InvisibleBottomBorder">Font Size</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "titleFontSize")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "titleFontSize")}></input></div>
                    </div>
                </div>

                <div className="pb-2">
                    <div><b>Horizontal Axis</b></div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "xlab")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "xlab")}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                        <div className = "InvisibleBottomBorder">Label Font Size</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "xlabFontSize")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "xlabFontSize")}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needXLim}>
                        <div className = "InvisibleBottomBorder">Lower Limit</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "xLowerLim")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "xLowerLim")}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needXLim}>
                        <div className = "InvisibleBottomBorder">Upper Limit</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "xUpperLim")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "xUpperLim")}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                        <div className = "InvisibleBottomBorder">Axis Font Size</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "xAxisFontSize")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "xAxisFontSize")}></input></div>
                    </div>
                </div>

                <div className="pb-2">
                    <div><b>Vertical Axis</b></div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "ylab")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "ylab")}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                        <div className = "InvisibleBottomBorder">Label Font Size</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "ylabFontSize")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "ylabFontSize")}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needYLim}>
                        <div className = "InvisibleBottomBorder">Lower Limit</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "yLowerLim")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "yLowerLim")}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needYLim} >
                        <div className = "InvisibleBottomBorder">Upper Limit</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "yUpperLim")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "yUpperLim")}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                        <div className = "InvisibleBottomBorder">Axis Font Size</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "yAxisFontSize")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "yAxisFontSize")}></input></div>
                    </div>
                </div>                  

                <div className="pb-2">
                    <div><b>Legends</b></div>
                    <div className="Label-And-Theme-Box" hidden = {!this.props.needFillLabel}>
                        <div className = "InvisibleBottomBorder">Color Fill Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "legendFillLab")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "legendFillLab")}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box" hidden = {!this.props.needColorLabel}>
                        <div className = "InvisibleBottomBorder">Color Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "legendColorLab")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "legendColorLab")}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box" hidden = {!this.props.needShapeLabel}>
                        <div className = "InvisibleBottomBorder">Shape Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "legendShapeLab")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "legendShapeLab")}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box" hidden = {!this.props.needSizeLabel}>
                        <div className = "InvisibleBottomBorder">Size Label</div>
                        <div><input className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "legendSizeLab")}
                        onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "legendSizeLab")}></input></div>
                    </div>
                        <div hidden = {this.state.basicMode || !(this.props.needFillLabel || this.props.needColorLabel || this.props.needShapeLabel || this.props.needSizeLabel)}>
                        <div className="Label-And-Theme-Box">
                            <div className = "InvisibleBottomBorder">Font Size</div>
                            <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                            onBlur = {(event) => this.props.updateAnalysisSettingCallback(event, "legendFontSize")}
                            onMouseLeave = {(event) => this.props.updateAnalysisSettingCallback(event, "legendFontSize")}></input></div>
                        </div>
                        <div className="Label-And-Theme-Box">
                            <div className = "InvisibleBottomBorder">Legend position</div>
                            <div>
                                <select defaultValue="Set2" style={{width: "300px"}} onChange = {(event) => this.props.updateAnalysisSettingCallback(event, "legendPosition")}>
                                    <option value="bottom">Bottom</option>
                                    <option value="right">Right</option>
                                    <option value="top">Top</option>
                                    <option value="left">Left</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="pb-2" hidden = {this.state.basicMode}>
                    <div><b>Theme</b></div>

                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Theme</div>
                        <div><select defaultValue="theme_bw" style={{width: "300px"}} onChange = {(event) => this.props.updateAnalysisSettingCallback(event, "theme")}>
                            <option value="theme_bw">Black and white theme</option>
                            <option value="ggplot_default">Default ggplot theme</option>
                            <option value="theme_classic">Classic theme</option>
                            <option value="theme_ipsum">Theme IPSUM</option>
                        </select></div>
                    </div>

                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Color Palette</div>
                        <div><select defaultValue="Set2" style={{width: "300px"}} onChange = {(event) => this.props.updateAnalysisSettingCallback(event, "colorPalette")}>
                            <option value="Set2">Set 2</option>
                            <option value="ggplot_default">ggplot Default</option>
                            <option value="Paired">Paired</option>
                            <option value="Greys">Greys</option>
                            <option value="Reds">Reds</option>
                            <option value="Greens">Greens</option>
                            <option value="Oranges">Oranges</option>
                            <option value="Blues">Blues</option>
                        </select></div>
                    </div>
                    
                </div>

                <Dialog open={this.state.showDialog} onClose={this.handleClose}>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Update</Button>
                        <Button onClick={this.handleClose}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}