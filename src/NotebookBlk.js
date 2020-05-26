import React, {Component} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-xcode";
import './Notebook.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-regular-svg-icons'

export class NotebookBlk extends Component {

    constructor(props){
        super(props)
        this.state = {
            Script: "",
        }
    }

    componentDidMount() {
        this.setState({Script: this.props.Script})
    }

    onLoad = (editor) => {
        editor.on('change',(arg, activeEditor) => {
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
    
    onBlur = (e, editor) => {
        this.props.updateAEditorValueCallback(this.props.index, this.state.Script)
    }


    //the below function needs to be update - potential updating pitfall
    updateAndRun = () => {
        this.props.updateAEditorValueCallback(this.props.index, this.state.Script);
        this.props.runScriptCallback();
    }

    onChange = (newValue) => {
        this.setState({Script: newValue})
    }

    render() {
        
        return (
            <div className={`pt-2 pb-2 pr-2 pl-5 notebook-block mt-2 ${this.props.Active ? "active-block" : "inactive-block"}`}
                onClick={() => this.props.gainFocusCallback(this.props.index)}>
                    <div className="notebook-title-grid" style={{width: this.props.ElementWidth}}>
                        <div><input defaultValue="--- Enter Analysis Title ---" className="titleEdit"/></div>
                        <div style={{float: "right"}}><CircularProgress style={{color: "#40a9ff"}} 
                        size={14} hidden={!this.props.Busy}/></div>
                        <div><FontAwesomeIcon icon={faEdit} /></div>                        
                    </div>
                    <AceEditor 
                    value = {this.state.Script}
                    onLoad={this.onLoad}
                    height="18px"
                    width={`${this.props.ElementWidth}px`}
                    fontSize={15}   
                    mode="python"
                    theme="xcode"
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    commands={[{   
                        name: 'runScript', 
                        bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'}, 
                        exec: this.updateAndRun
                      }]}                        
                    name={this.props.NotebookBlkID} 
                    editorProps={{ $blockScrolling: true }}
                    />
                    <div className="ROutputText p-2">
                        {
                            this.props.ROutput.map( (output, index) =>                                 
                                <code className={output.OutputType} key={index}>{output.Output}</code>                                
                            )
                        }
                    </div>          
                    <div style={{width: this.props.ElementWidth}}>
                        <Editor
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorTextArea"
                        onEditorStateChange={this.onEditorStateChange}           
                        />
                    </div>              
            </div>
        )
    }
}