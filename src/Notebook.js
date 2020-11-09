import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import {faObjectUngroup} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import "./Notebook.css"
import {NotebookBlk} from "./NotebookBlk";
import "./App.css";
import NativeSelect from '@material-ui/core/NativeSelect';
import {faSave} from '@fortawesome/free-regular-svg-icons';

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);

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

export class Notebook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ElementWidth: 100,
        }
        this.ContainerRef = React.createRef();
        console.log(this.ContainerRef)
        this.NotebookBlkRef = {}

    }

    setElement = (element) => {
        if (element !== null) {
            this.NotebookBlkRef[element.attributes.name.value] = {}
            this.NotebookBlkRef[element.attributes.name.value].element = element;
            console.log(this.NotebookBlkRef)
        }
    }

    scrollToBlk = (event) => {
        if (event.target.value !== "") {
            this.NotebookBlkRef[event.target.value].element.scrollIntoView({behavior: "smooth"})
            let blkIndex = this.props.NotebookBlkList.findIndex((item) => item.NotebookBlkID === event.target.value)
            this.props.gainFocusCallback(blkIndex)
        }
    }

    updateAEditorWidth = () => {
        if (this.ContainerRef.current) {
            this.setState({ElementWidth: this.ContainerRef.current.offsetWidth-80});
        }
    }

    componentDidUpdate = () => {
        if (this.props.clearNotebookBlkRef) {
            this.NotebookBlkRef = {}
            this.props.resetClearNotebookBlkRefCallback(false)
        }
    }

    componentDidMount = () => {
        this.updateAEditorWidth();
        window.addEventListener("resize", this.updateAEditorWidth);
    }
    
    componentWillUnmount = () => {
        window.removeEventListener('resize', this.updateAEditorWidth);
    }

    delBlkAndRmRef = () => {
        let tmp = this.props.NotebookBlkList.filter((item) => item.selected)

        console.log(this.NotebookBlkRef)

        if (tmp.length === 0) {
            delete this.NotebookBlkRef[this.props.ActiveBlkID]
        }else {
            tmp.forEach((blk) => {
                delete this.NotebookBlkRef[blk.NotebookBlkID]
            })
        }
        this.props.delBlkCallback()
    }

    mergeBlkAndRmRef = () => {
        let tmp = this.props.NotebookBlkList.filter((item) => item.selected)
        console.log(this.NotebookBlkRef)
        if (tmp.length >= 2) {
            tmp.shift()
            tmp.forEach((blk) => {
                delete this.NotebookBlkRef[blk.NotebookBlkID]
            })
            this.props.mergeBlkCallback()
        }
        console.log(this.NotebookBlkRef)
    }

    render() {
        return (
            <div ref={this.ContainerRef} >
                
                <div className="notebook-bar">
                    <StyledTooltip title="Ctrl-Enter to run the current block."><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={() => this.props.runScriptCallback(true)}> 
                        <FontAwesomeIcon icon={faPlay}/>
                    </StyledButton></StyledTooltip>
                    <StyledTooltip title={<div>Alt-A to add a block</div>}><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={ () => this.props.addExtraBlkCallback("",false)}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </StyledButton></StyledTooltip>
                    <StyledTooltip title={<div>Delete</div>}><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={() => this.delBlkAndRmRef()}>
                        <FontAwesomeIcon icon={faTrashAlt}/>
                    </StyledButton></StyledTooltip>
                    <StyledTooltip title={<div>Merge</div>}><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={() => this.mergeBlkAndRmRef()}>
                        <FontAwesomeIcon icon={faObjectUngroup}/>
                    </StyledButton></StyledTooltip>
                    <StyledTooltip title="Alt-Up"><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={()=>{this.props.reorderNotebookBlkCallback("Up")}}>
                        <FontAwesomeIcon icon={faArrowUp}/>
                    </StyledButton></StyledTooltip>
                    <StyledTooltip title="Alt-Down"><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={()=>{this.props.reorderNotebookBlkCallback("Down")}}>
                        <FontAwesomeIcon icon={faArrowDown}/>
                    </StyledButton></StyledTooltip>
                    <StyledTooltip title={<div>Current file: {this.props.NotebookPath}</div>}><StyledButton style={{maxWidth: '36px', minWidth: '36px', maxHeight: '36px', minHeight: '36px'}} disableRipple onClick={()=>{this.props.savingFileCallback(false)}}>
                        <FontAwesomeIcon icon={faSave}/>
                    </StyledButton></StyledTooltip>
                    <StyledNativeSelect style={{fontSize: "14px"}} inputProps={{style: {minWidth: "250px", maxWidth: "250px"}}} onChange={(event) => this.scrollToBlk(event)}>
                        <option value = "">-- Navigate to --</option>
                        {
                            this.props.NotebookBlkList.map((Blk, index) => 
                                <option value = {Blk.NotebookBlkID}>{Blk.Title}</option>
                            )
                        }
                    </StyledNativeSelect>
                </div>

                <div className="notebook-blk">
                {
                    this.props.NotebookBlkList.map( (Blk, index) =>
                        <div key={Blk.NotebookBlkID} name={Blk.NotebookBlkID} ref = {this.setElement}>
                            <NotebookBlk key={Blk.NotebookBlkID} 
                            index = {index}
                            ID = {Blk.NotebookBlkID}
                            ElementWidth={this.state.ElementWidth} 
                            ActiveBlkID={this.props.ActiveBlkID}
                            CurrentVariableList = {this.props.CurrentVariableList}

                            notebookState = {Blk}
                            addExtraBlkCallback={this.props.addExtraBlkCallback}
                            runScriptCallback={this.props.runScriptCallback}
                            gainFocusCallback={this.props.gainFocusCallback}
                            updateAEditorValueCallback={this.props.updateAEditorValueCallback}
                            toggleEditorCallback = {this.props.toggleTEditorCallback}
                            toggleNotebookBlkCallback = {this.props.toggleNotebookBlkCallback}
                            updateNotebookBlkStateCallback = {this.props.updateNotebookBlkStateCallback}
                            restorePanelSettingCallback = {this.props.restorePanelSettingCallback}
                            selectNotebookBlkCallback = {this.props.selectNotebookBlkCallback}
                            setNotebookBlkUpdate2FalseCallback = {this.props.setNotebookBlkUpdate2FalseCallback}
                            reorderNotebookBlkCallback = {this.props.reorderNotebookBlkCallback}

                            />       
                        </div>                 
                        )
                }
                </div> 
                                
            </div>
        )
    }
    
}