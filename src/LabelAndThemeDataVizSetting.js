import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import NativeSelect from '@material-ui/core/NativeSelect';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";

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
            
            localSetting: {
                title: "",
                titleFontSize: "",
                xlab: "",
                xlabFontSize: "",
                xLowerLim: "",
                xUpperLim: "",
                xAxisFontSize: "",
                ylab: "",
                yLowerLim: "",
                yUpperLim: "",
                ylabFontSize: "",
                yAxisFontSize: "",
                legendFillLab: "",
                legendColorLab: "",
                legendShapeLab: "",
                legendSizeLab: "",
                legendFontSize: "",
                legendKeyFontSize: "",
                facetFontSize: "",
            }
        }
    }

    switchMode = () => {
        this.setState({basicMode: !this.state.basicMode})
    }

    handleOpen = () => {
        this.setState({showDialog: true})
    }

    handleClose = (action) => {
        if (action === "Update") {
            this.props.updateLabelAndThemeSettingCallback(this.state.localSetting)
        }
        this.setState({showDialog: false})
    }

    updateLocalSetting = (event, target) => {
        let localSettingObj = {...this.state.localSetting}
        localSettingObj[target] = event.target.value
        this.setState({localSetting: {...localSettingObj}})
    }

    render () {
        return (
            <div>
                <div className = "pb-2">
                    <div><StyledButton disableRipple onClick = {() => this.switchMode()}><FormatListBulletedIcon fontSize="small"/>
                        <div className="ml-1">Switch to {(this.state.basicMode ? "Advanced": "Basic")} mode</div></StyledButton></div>
                    </div>
                <div className="pb-2">
                    <div><b>Title</b></div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Label</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.title}
                        ></input></div>
                    </div>
                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                        <div className = "InvisibleBottomBorder">Font Size</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.titleFontSize}></input></div>
                    </div>
                </div>

                <div className="pb-2">
                    <div><b>Horizontal Axis</b></div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Label</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.xlab}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                        <div className = "InvisibleBottomBorder">Label Font Size</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.xlabFontSize}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needXLim}>
                        <div className = "InvisibleBottomBorder">Lower Limit</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.xLowerLim}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needXLim}>
                        <div className = "InvisibleBottomBorder">Upper Limit</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.xUppperLim}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                        <div className = "InvisibleBottomBorder">Axis Font Size</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.xAxisFontSize}></input></div>
                    </div>
                </div>

                <div className="pb-2">
                    <div><b>Vertical Axis</b></div>
                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Label</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.ylab}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                        <div className = "InvisibleBottomBorder">Label Font Size</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.ylabFontSize}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needYLim}>
                        <div className = "InvisibleBottomBorder">Lower Limit</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.yLowerLim}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needYLim} >
                        <div className = "InvisibleBottomBorder">Upper Limit</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.yUpperLim}></input></div>
                    </div>

                    <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                        <div className = "InvisibleBottomBorder">Axis Font Size</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.yAxisFontSize}></input></div>
                    </div>
                </div>                  

                <div className="pb-2">
                    <div><b>Legends</b></div>
                    <div className="Label-And-Theme-Box" hidden = {!this.props.needFillLabel}>
                        <div className = "InvisibleBottomBorder">Color Fill Label</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.legendFillLab}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box" hidden = {!this.props.needColorLabel}>
                        <div className = "InvisibleBottomBorder">Color Label</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.legendColorLab}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box" hidden = {!this.props.needShapeLabel}>
                        <div className = "InvisibleBottomBorder">Shape Label</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.legendShapeLab}></input></div>
                    </div>
                    <div className="Label-And-Theme-Box" hidden = {!this.props.needSizeLabel}>
                        <div className = "InvisibleBottomBorder">Size Label</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.legendSizeLab}></input></div>
                    </div>
                    <div hidden = {this.state.basicMode || !(this.props.needFillLabel || this.props.needColorLabel || this.props.needShapeLabel || this.props.needSizeLabel)}>
                        <div className="Label-And-Theme-Box">
                            <div className = "InvisibleBottomBorder">Title Font Size</div>
                            <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                            onClick = {() => this.handleOpen()}
                            value = {this.props.AnalysisSetting.legendFontSize}></input></div>
                        </div>
                        
                        <div className="Label-And-Theme-Box">
                            <div className = "InvisibleBottomBorder">Key Font Size</div>
                            <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                            onClick = {() => this.handleOpen()}
                            value = {this.props.AnalysisSetting.legendKeyFontSize}></input></div>
                        </div>

                        <div className="Label-And-Theme-Box">
                            <div className = "InvisibleBottomBorder">Legend position</div>
                            <div>
                                <select value={this.props.AnalysisSetting.legendPosition} style={{width: "300px"}} onChange = {(event) => this.props.updateAnalysisSettingCallback(event, "legendPosition")}>
                                    <option value="bottom">Bottom</option>
                                    <option value="right">Right</option>
                                    <option value="top">Top</option>
                                    <option value="left">Left</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pb-2">
                    <div><b>Facet</b></div>
                    <div className="Label-And-Theme-Box" hidden = {!this.props.needFacetFontSize || this.state.basicMode}>
                        <div className = "InvisibleBottomBorder">Font Size</div>
                        <div><input readonly className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                        onClick = {() => this.handleOpen()}
                        value = {this.props.AnalysisSetting.facetFontSize}></input></div>
                    </div>
                </div>


                <div className="pb-2" hidden = {this.state.basicMode}>
                    <div><b>Theme</b></div>

                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Theme</div>
                        <div><select value={this.props.AnalysisSetting.theme} style={{width: "300px"}} onChange = {(event) => this.props.updateAnalysisSettingCallback(event, "theme")}>
                            <option value="theme_bw">Black and white theme</option>
                            <option value="ggplot_default">Default ggplot theme</option>
                            <option value="theme_classic">Classic theme</option>
                            <option value="theme_ipsum">Theme IPSUM</option>
                        </select></div>
                    </div>

                    <div className="Label-And-Theme-Box">
                        <div className = "InvisibleBottomBorder">Color Palette</div>
                        <div><select value={this.props.AnalysisSetting.colorPalette} style={{width: "300px"}} onChange = {(event) => this.props.updateAnalysisSettingCallback(event, "colorPalette")}>
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
                    <DialogTitle>Update Labels and Themes</DialogTitle>
                    <DialogContent>
                        <div className="pb-2">
                            <div><b>Title</b></div>
                                <div className="Label-And-Theme-Box">
                                    <div className = "InvisibleBottomBorder">Label</div>
                                    <div><input value = {this.state.localSetting.title} className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                                    onChange = {(event) => this.updateLocalSetting(event, "title")}
                                    ></input></div>
                                </div>
                                <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                                    <div className = "InvisibleBottomBorder">Font Size</div>
                                    <div><input value = {this.state.localSetting.titleFontSize} className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                    onChange = {(event) => this.updateLocalSetting(event, "titleFontSize")}></input>
                                </div>
                            </div>
                        </div>

                        <div className="pb-2">
                            <div><b>Horizontal Axis</b></div>
                            <div className="Label-And-Theme-Box">
                                <div className = "InvisibleBottomBorder">Label</div>
                                <div><input value = {this.state.localSetting.xlab} className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "xlab")}></input></div>
                            </div>

                            <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                                <div className = "InvisibleBottomBorder">Label Font Size</div>
                                <div><input value = {this.state.localSetting.xlabFontSize} className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "xlabFontSize")}></input></div>
                            </div>

                            <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needXLim}>
                                <div className = "InvisibleBottomBorder">Lower Limit</div>
                                <div><input value = {this.state.localSetting.xLowerLim} className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "xLowerLim")}></input></div>
                            </div>

                            <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needXLim}>
                                <div className = "InvisibleBottomBorder">Upper Limit</div>
                                <div><input value = {this.state.localSetting.xUpperLim} className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "xUpperLim")}></input></div>
                            </div>

                            <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                                <div className = "InvisibleBottomBorder">Axis Font Size</div>
                                <div><input value = {this.state.localSetting.xAxisFontSize} className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "xAxisFontSize")}></input></div>
                            </div>
                        </div>

                        <div className="pb-2">
                            <div><b>Vertical Axis</b></div>
                            <div className="Label-And-Theme-Box">
                                <div className = "InvisibleBottomBorder">Label</div>
                                <div><input value = {this.state.localSetting.ylab} className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "ylab")}></input></div>
                            </div>

                            <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                                <div className = "InvisibleBottomBorder">Label Font Size</div>
                                <div><input value = {this.state.localSetting.ylabFontSize} className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "ylabFontSize")}></input></div>
                            </div>

                            <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needYLim}>
                                <div className = "InvisibleBottomBorder">Lower Limit</div>
                                <div><input value = {this.state.localSetting.yLowerLim} className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "yLowerLim")}></input></div>
                            </div>

                            <div className="Label-And-Theme-Box" hidden = {this.state.basicMode || !this.props.needYLim} >
                                <div className = "InvisibleBottomBorder">Upper Limit</div>
                                <div><input value = {this.state.localSetting.yUpperLim} className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "yUpperLim")}></input></div>
                            </div>

                            <div className="Label-And-Theme-Box" hidden = {this.state.basicMode}>
                                <div className = "InvisibleBottomBorder">Axis Font Size</div>
                                <div><input value = {this.state.localSetting.yAxisFontSize} className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "yAxisFontSize")}></input></div>
                            </div>
                        </div>
                        
                        <div className="pb-2">
                            <div><b>Legends</b></div>
                            <div className="Label-And-Theme-Box" hidden = {!this.props.needFillLabel}>
                                <div className = "InvisibleBottomBorder">Color Fill Label</div>
                                <div><input value = {this.state.localSetting.legendFillLab} className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "legendFillLab")}></input></div>
                            </div>
                            <div className="Label-And-Theme-Box" hidden = {!this.props.needColorLabel}>
                                <div className = "InvisibleBottomBorder">Color Label</div>
                                <div><input value = {this.state.localSetting.legendColorLab} className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "legendColorLab")}></input></div>
                            </div>
                            <div className="Label-And-Theme-Box" hidden = {!this.props.needShapeLabel}>
                                <div className = "InvisibleBottomBorder">Shape Label</div>
                                <div><input value = {this.state.localSetting.legendShapeLab} className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "legendShapeLab")}></input></div>
                            </div>
                            <div className="Label-And-Theme-Box" hidden = {!this.props.needSizeLabel}>
                                <div className = "InvisibleBottomBorder">Size Label</div>
                                <div><input value = {this.state.localSetting.legendSizeLab} className = "LabelAndThemeSettingInput" style={{width: "350px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "legendSizeLab")}></input></div>
                            </div>
                            <div hidden = {this.state.basicMode || !(this.props.needFillLabel || this.props.needColorLabel || this.props.needShapeLabel || this.props.needSizeLabel)}>
                                <div className="Label-And-Theme-Box">
                                    <div className = "InvisibleBottomBorder">Title Font Size</div>
                                    <div><input value = {this.state.localSetting.legendFontSize} className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                    onChange = {(event) => this.updateLocalSetting(event, "legendFontSize")}></input></div>
                                </div>

                                <div className="Label-And-Theme-Box">
                                    <div className = "InvisibleBottomBorder">Key Font Size</div>
                                    <div><input value = {this.state.localSetting.legendKeyFontSize} className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                    onChange = {(event) => this.updateLocalSetting(event, "legendKeyFontSize")}></input></div>
                                </div>

                                <div className="Label-And-Theme-Box">
                                    <div className = "InvisibleBottomBorder">Legend position</div>
                                    <div>
                                        <select value = {this.props.AnalysisSetting.legendPosition} style={{width: "300px"}} onChange = {(event) => this.props.updateAnalysisSettingCallback(event, "legendPosition")}>
                                            <option value="bottom">Bottom</option>
                                            <option value="right">Right</option>
                                            <option value="top">Top</option>
                                            <option value="left">Left</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pb-2">
                            <div><b>Facet</b></div>
                            <div className="Label-And-Theme-Box" hidden = {!this.props.needFacetFontSize || this.state.basicMode}>
                                <div className = "InvisibleBottomBorder">Font Size</div>
                                <div><input className = "LabelAndThemeSettingInput" style={{width: "120px"}}
                                onChange = {(event) => this.updateLocalSetting(event, "facetFontSize")}
                                value = {this.state.localSetting.facetFontSize}></input></div>
                            </div>
                        </div>

                        <div className="pb-2" hidden = {this.state.basicMode}>
                            <div><b>Theme</b></div>

                            <div className="Label-And-Theme-Box">
                                <div className = "InvisibleBottomBorder">Theme</div>
                                <div><select value = {this.props.AnalysisSetting.theme} style={{width: "300px"}} onChange = {(event) => this.props.updateAnalysisSettingCallback(event, "theme")}>
                                    <option value="theme_bw">Black and white theme</option>
                                    <option value="ggplot_default">Default ggplot theme</option>
                                    <option value="theme_classic">Classic theme</option>
                                    <option value="theme_ipsum">Theme IPSUM</option>
                                </select></div>
                            </div>

                            <div className="Label-And-Theme-Box">
                                <div className = "InvisibleBottomBorder">Color Palette</div>
                                <div><select value = {this.props.AnalysisSetting.colorPalette} style={{width: "300px"}} onChange = {(event) => this.props.updateAnalysisSettingCallback(event, "colorPalette")}>
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
                    </DialogContent>
                    <DialogActions>
                        <StyledButton onClick={() => this.handleClose("Update")}>UPDATE</StyledButton>
                        <StyledButton onClick={() => this.handleClose("Cancel")}>CANCEL</StyledButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}