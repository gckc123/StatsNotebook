import React, {Component} from "react";
import {NotebookBar} from "./Notebookbar";
import {NotebookBlk} from "./NotebookBlk";
import "./App.css"


export class Notebook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ElementWidth: 100,
        }
        this.ContainerRef = React.createRef();
    }

    updateAEditorWidth = () => {
        if (this.ContainerRef.current) {
            this.setState({ElementWidth: this.ContainerRef.current.offsetWidth-80});
        }
    }

    componentDidMount = () => {
        this.updateAEditorWidth();
        window.addEventListener("resize", this.updateAEditorWidth);
    }
    
    componentWillUnmount = () => {
        window.removeEventListener('resize', this.updateAEditorWidth);
    }


    render() {
        return (
            <div ref={this.ContainerRef}>
                <NotebookBar 
                addExtraBlkCallback={this.props.addExtraBlkCallback} 
                reorderNotebookBlkCallback = {this.props.reorderNotebookBlkCallback}
                delBlkCallback={this.props.delBlkCallback}
                runScriptCallback={this.props.runScriptCallback}/>
                <div className="notebook-blk">
                {
                    this.props.NotebookBlkList.map( (Blk, index) =>
                        <NotebookBlk key={Blk.NotebookBlkID} 
                        index = {index}
                        ElementWidth={this.state.ElementWidth} 
                        ActiveBlkID={this.props.ActiveBlkID}
                        CurrentVariableList = {this.props.CurrentVariableList}

                        notebookState = {Blk}

                        runScriptCallback={this.props.runScriptCallback}
                        gainFocusCallback={this.props.gainFocusCallback}
                        updateAEditorValueCallback={this.props.updateAEditorValueCallback}
                        toggleEditorCallback = {this.props.toggleTEditorCallback}
                        toggleNotebookBlkCallback = {this.props.toggleNotebookBlkCallback}
                        updateNotebookBlkStateCallback = {this.props.updateNotebookBlkStateCallback}
                        restorePanelSettingCallback = {this.props.restorePanelSettingCallback}
                        
                        />                        
                        )
                }
                </div>   
            </div>
        )
    }
    
}