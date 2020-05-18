import React, {Component} from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-xcode";
import './Notebook.css';

export class NotebookBlk extends Component {

    keyMap = {
        RUNSCRIPT: "ctrl+enter",
        MOVE_UP: "up"
    };

    KeyboardShortCutHandler = {
        RUNSCRIPT: event => this.props.runScriptCallback,
        MOVE_UP: event => console.log("Move up hotkey called!")
    };
    
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
    
    onChange = (newValue) => {
        this.props.updateAEditorValueCallback(this.props.index, newValue)
    }

    render() {

        return (
            <div className={`pt-2 pb-2 pr-2 pl-5 notebook-block mt-2 ${this.props.Active ? "active-block" : "inactive-block"}`}
                onClick={() => this.props.gainFocusCallback(this.props.index)}>                        
                    <AceEditor 
                    value = {this.props.Script}
                    onLoad={this.onLoad}
                    height="18px"
                    width={`${this.props.ElementWidth}px`}
                    fontSize={15}   
                    mode="python"
                    theme="xcode"
                    onChange={this.onChange}
                    commands={[{   
                        name: 'runScript', 
                        bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'}, 
                        exec: this.props.runScriptCallback  
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
            </div>
        )
    }
}