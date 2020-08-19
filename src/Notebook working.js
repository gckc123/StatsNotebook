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
                        ElementWidth={this.state.ElementWidth} ActiveBlkID={this.props.ActiveBlkID}
                        Busy = {Blk.Busy}
                        Expanded = {Blk.Expanded}
                        NotebookBlkID={Blk.NotebookBlkID}
                        
                        Script={this.props.NotebookBlkList[index].NotebookBlkScript}
                        Title={this.props.NotebookBlkList[index].Title}
                        editorHTML={this.props.NotebookBlkList[index].editorHTML}
                        runScriptCallback={this.props.runScriptCallback}
                        ROutput={this.props.NotebookBlkList[index].NotebookBlkROutput}
                        showEditor = {this.props.NotebookBlkList[index].showEditor}

                        notebookState = {Blk}

                        gainFocusCallback={this.props.gainFocusCallback}
                        updateAEditorValueCallback={this.props.updateAEditorValueCallback}
                        toggleEditorCallback = {this.props.toggleTEditorCallback}
                        toggleNotebookBlkCallback = {this.props.toggleNotebookBlkCallback}
                        updateNotebookBlkStateCallback = {this.props.updateNotebookBlkStateCallback}/>                        
                        )
                }
                </div>   
            </div>
        )
    }
    
}