import React, {Component} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-r"
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-tomorrow";
import './Notebook.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-regular-svg-icons';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { faLaptopCode } from '@fortawesome/free-solid-svg-icons';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';

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

export class NotebookBlk extends Component {

    constructor(props){
        super(props)
        this.state = {
            Script: "",
            Title: "",
            editorHTML: "",
            message: "",
            showMessage: false,
        }
    }

    TEditorModules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike'],
          [{ 'script': 'sub'}, { 'script': 'super' }], 
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{ 'color': [] }, { 'background': [] }],  
          ['link', 'image'],
          [{ 'align': [] }],
          ['clean']    
        ],
      }

    componentDidMount() {
        this.setState({
            Script: this.props.notebookState.NotebookBlkScript,
            Title: this.props.notebookState.Title,
            editorHTML: this.props.notebookState.editorHTML,
        })
    }

    onLoad = (editor) => {
        editor.on('change',(arg, activeEditor) => {
            const AEditor = activeEditor;
            const newHeight = AEditor.getSession().getScreenLength() *
            (AEditor.renderer.lineHeight) + AEditor.renderer.scrollBar.getWidth() + 20;
            AEditor.container.style.height = `${newHeight}px`;
            AEditor.resize();
        })
        editor.on('focus',(arg, activeEditor) => {
            const AEditor = activeEditor;
            const newHeight = AEditor.getSession().getScreenLength() *
            (AEditor.renderer.lineHeight) + AEditor.renderer.scrollBar.getWidth() + 20;
            AEditor.container.style.height = `${newHeight}px`;
            AEditor.resize();
        })
        //Update the size immediately if the editor is initialised with codes.
        let AEditor = editor;
        let newHeight = AEditor.getSession().getScreenLength() *
        (AEditor.renderer.lineHeight) + AEditor.renderer.scrollBar.getWidth() + 20;
        AEditor.container.style.height = `${newHeight}px`;
        AEditor.resize();
    }
    
    onAEBlur = (e, editor) => {
        this.props.updateAEditorValueCallback(this.props.index, this.state.Script, false)
    }

    onBlkBlur = () => {
        this.props.updateNotebookBlkStateCallback(this.props.index, this.state.Script, this.state.Title, this.state.editorHTML)
    }

    updateAndRun = () => {
        this.props.updateAEditorValueCallback(this.props.index, this.state.Script, true);
    }

    onAEChange = (newValue) => {
        this.setState({Script: newValue})
    }

    onTitleChange = (event) => {
        this.setState({Title: event.target.value})
    }

    onTEChange = (html) => {
        this.setState({editorHTML: html})
    }

    not = (array1, array2) => {
        return array1.filter((item) => array2.indexOf(item) === -1)
    }

    checkAndRestore = () => {
        if (this.props.notebookState.genScript === this.state.Script) {
            let notebookStateVarName = Object.keys(this.props.notebookState.varState)
            if (JSON.stringify(notebookStateVarName.sort()) === JSON.stringify(Object.keys(this.props.CurrentVariableList).sort())) {
                let mismatchVarType = []
                notebookStateVarName.forEach((item) => {
                    if (this.props.notebookState.varState[item][0] !== this.props.CurrentVariableList[item][0]) {
                        mismatchVarType.push(item)
                    }
                })
                if (mismatchVarType.length === 0) {
                    console.log(this.props.notebookState.panelState)
                    this.props.restorePanelSettingCallback(this.props.index)
                }else{
                    this.setState({message: "The variable type of the following variables does not match with the their original types when the codes are generated: " +
                    mismatchVarType.join(", ") + ". This indicates that the dataset might have changed since the codes were generated.<br/>The analysis menu will not be restored."
                })
                }
            }else{
                let notInCurrentList = this.not(notebookStateVarName, Object.keys(this.props.CurrentVariableList))
                let notInNotebookVarList = this.not(Object.keys(this.props.CurrentVariableList), notebookStateVarName)
                this.setState({message: "The current list of variables are not the same as the one used to generate the codes in this block. "+
                "This indicates that the dataset might have changed since the codes were generated. "+
                (notInCurrentList.length > 0 ? "The following variables were missing in the current variable list: " +
                notInCurrentList.join(", ") + ". " : "")  +
                (notInNotebookVarList.length > 0 ? "The following variables are in the current variable list but not in the variable list when the codes were generated: " +
                notInNotebookVarList.join(", ") + ". " : "") +
                "This analysis menu will not be restored.", showMessage: true})
            }
        }else{
            this.setState({message: "The codes in this block has been changed since they were generated from menu. The analysis menu will not be restored.", showMessage: true})
        }
    }

    closeMessage = () => {
        this.setState({showMessage: false})
    }

    dumpStatus = () => {
        console.log(this.props.notebookState.panelState)
    }

    render() {
        
        return (
            <div className={`pt-2 pb-2 pr-2 pl-5 notebook-block mt-2 ${this.props.ActiveBlkID === this.props.notebookState.NotebookBlkID ? "active-block" : "inactive-block"}`}
                onClick={() => this.props.gainFocusCallback(this.props.index)}>
                    <div hidden={true}>
                        <StyledIconButton size="small" onClick={() => this.dumpStatus()}><CloseIcon /></StyledIconButton><span className="Warning">Dump notebook status</span>
                    </div>
                    <div hidden = {!this.state.showMessage}>
                        <StyledIconButton size="small" onClick={() => this.closeMessage()}><CloseIcon /></StyledIconButton><span className="Warning">{this.state.message}</span>
                    </div>
                    <div className="notebook-title-grid" style={{width: this.props.ElementWidth}}>
                        <div>
                            <StyledIconButton size="small" hidden = {!this.props.notebookState.Expanded}
                            onClick = {()=>{this.props.toggleNotebookBlkCallback(this.props.index)}}><ExpandLessIcon /></StyledIconButton>
                            <StyledIconButton size="small" hidden = {this.props.notebookState.Expanded}
                            onClick = {() => {this.props.toggleNotebookBlkCallback(this.props.index)}}><ExpandMoreIcon /></StyledIconButton>
                            <input value={this.state.Title} className="titleEdit" onChange={(event) => this.onTitleChange(event)}
                        onBlur = {this.onBlkBlur}/>
                        </div>
                        <div style={{float: "right"}}><CircularProgress style={{color: "#40a9ff"}} 
                        size={14} hidden={!this.props.notebookState.Busy}/></div>
                        
                        <div><div hidden={this.props.notebookState.genScript === ""}>
                            <StyledTooltip title={<div>Restore menu setting.<br />Please note the menu can be restored only if the codes generated are not changed and the variable list is not changed.
                            </div>}><StyledIconButton size="small" onClick={() => {this.checkAndRestore()}}>
                            <FontAwesomeIcon icon={faLaptopCode} /></StyledIconButton></StyledTooltip></div>
                        </div>
                        <div><StyledTooltip title="Show text editor"><StyledIconButton size="small" onClick={()=>{this.props.toggleEditorCallback(this.props.index)}}>
                            <FontAwesomeIcon icon={faEdit} /></StyledIconButton></StyledTooltip></div>
                    </div>
                    <div hidden = {!this.props.notebookState.Expanded}>
                    <AceEditor 
                    value = {this.state.Script}
                    onLoad={this.onLoad}
                    height="18px"
                    width={`${this.props.ElementWidth}px`}
                    fontSize={15}   
                    mode="r"
                    theme="tomorrow"
                    onChange={this.onAEChange}
                    onBlur={this.onAEBlur}
                    commands={[{   
                        name: 'runScript', 
                        bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'}, 
                        exec: this.updateAndRun
                      }]}                        
                    name={this.props.notebookState.NotebookBlkID} 
                    editorProps={{ $blockScrolling: true }}
                    />
                    <div className="ROutputText p-2">
                        {
                            this.props.notebookState.NotebookBlkROutput.map( (output, index) =>  {      
                                    if (output.OutputType[0] === "Normal" || output.OutputType[0] === "Warning" || output.OutputType[0] === "Message" || output.OutputType[0] === "Error") {                        
                                        return (
                                            <div key={index}>
                                                <div style={{color: "black", fontWeight: "bold"}}>######################################################</div>
                                                <div><code className={output.OutputType} key={index}>{output.Output}</code></div>
                                            </div>
                                        )
                                    }else if (output.OutputType[0] === "Graphics")
                                    {
                                        let graphicsData = "data:image/png;base64," + output.Output
                                        return (
                                            <div key={index}>
                                                <div style={{color: "black", fontWeight: "bold"}}>######################################################</div>
                                                <div><img width={this.props.ElementWidth*0.8} src={graphicsData} alt=""/></div>
                                            </div>
                                            
                                        )
                                    }
                                    return null
                                }                                
                            )
                        }
                    </div>          
                    <div style={{width: this.props.ElementWidth}} hidden={!this.props.notebookState.showEditor} onBlur={this.onBlkBlur}>
                        <ReactQuill
                            theme="snow"
                            modules={this.TEditorModules}
                            onChange={this.onTEChange}
                            value={this.state.editorHTML}
                            placeholder="--- Your Notes Here ---"                            
                        />
                    </div>
                    </div>              
            </div>
        )
    }
}