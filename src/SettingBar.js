import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {faFile} from '@fortawesome/free-regular-svg-icons';
import {faFolderOpen} from '@fortawesome/free-regular-svg-icons';
import {faSave} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem"
import "./App.css";
import { Divider } from '@material-ui/core';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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

const MenuItemStyle = {
    fontSize: 'small',
}

class OpenFileMenu extends Component {

    openFile = (fileType) => {
        this.props.openFileCallback(fileType)
        this.props.handleClose()
    }

    render () {
        let open = Boolean(this.props.anchorEl)
        return (
            <Menu anchorEl={this.props.anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin = {{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open = {open}
                onClose={this.props.handleClose}>
                <MenuItem onClick={() => this.openFile("CSV")} disableRipple style = {MenuItemStyle}>CSV</MenuItem>
                <MenuItem onClick={() => this.openFile("SPSS")} disableRipple style = {MenuItemStyle}>SPSS</MenuItem>
                <MenuItem onClick={() => this.openFile("STATA")} disableRipple style = {MenuItemStyle}>STATA</MenuItem>
                <Divider />
                <MenuItem onClick={() => this.props.handleExampleDataDialogOpenCallback()} disableRipple style = {MenuItemStyle}>Example data</MenuItem>
                <Divider />
                <MenuItem onClick={() => this.openFile("Notebook")} disableRipple style = {MenuItemStyle}>Notebook</MenuItem>
            </Menu>
        )
    }
}

class SaveFileMenu extends Component {

    saveFile = (fileType) => {
        switch(fileType) {
            case "CSV":
            case "SPSS":
            case "STATA":
                this.props.savingDataFileCallback(fileType);
                break;
            case "RNB":
                this.props.savingFileCallback();
                break;
            default:
                break;
        }
        
        this.props.handleClose()
    }

    render () {
        let open = Boolean(this.props.anchorEl)
        return (
            <Menu anchorEl={this.props.anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin = {{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open = {open}
                onClose={this.props.handleClose}>
                <MenuItem onClick={() => this.saveFile("CSV")} disableRipple style = {MenuItemStyle}>CSV</MenuItem>
                <MenuItem onClick={() => this.saveFile("SPSS")} disableRipple style = {MenuItemStyle}>SPSS</MenuItem>
                <MenuItem onClick={() => this.saveFile("STATA")} disableRipple style = {MenuItemStyle}>STATA</MenuItem>
                <Divider />
                <MenuItem onClick={() => this.saveFile("RNB")} disableRipple style = {MenuItemStyle}>Notebook</MenuItem>
            </Menu>
        )
    }
}

export class SettingBar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            anchorSaveMenu: null,
            showExampleDataDialog: false
        }
    }

    handleMenu = (event) => {
        this.setState({anchorEl: event.currentTarget})
    }

    handleClose = (event) => {
        this.setState({anchorEl: null})
    }

    handleSaveMenu = (event) => {
        this.setState({anchorSaveMenu: event.currentTarget})
    }

    handleSaveClose = (event) => {
        this.setState({anchorSaveMenu: null})
    }

    handleExampleDataDialogOpen = () => {
        this.handleClose()
        this.setState({showExampleDataDialog: true})
    }

    handleExampleDataDialogClose = () => {        
        this.setState({showExampleDataDialog: false})
    }

    openExampleData = (exampleData) => {
        let script = "library(StatsNotebookServer)\nlibrary(carData)\ndata(" + exampleData + ")\ncurrentDataset <- " + exampleData
        this.props.addExtraBlkCallback(script, true)
        this.handleExampleDataDialogClose()
    }

    render () {
        return (
            <div>
                <div className="app-bar">
                    <StyledButton disableRipple onClick={this.props.newNotebookCallback}>
                        <FontAwesomeIcon icon={faFile}/><div className='ml-1'>New</div>
                    </StyledButton>
                    <StyledButton disableRipple onClick={this.handleMenu}>
                        <FontAwesomeIcon icon={faFolderOpen} /><div className='ml-1'>Open</div>                    
                    </StyledButton>
                    <OpenFileMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                        openFileCallback = {this.props.openFileCallback}
                        handleExampleDataDialogOpenCallback = {this.handleExampleDataDialogOpen}/>
                    <StyledButton disableRipple onClick={this.handleSaveMenu}>
                        <FontAwesomeIcon icon={faSave}/><div className='ml-1'>Save</div>
                    </StyledButton>
                    <SaveFileMenu handleClose = {this.handleSaveClose} anchorEl = {this.state.anchorSaveMenu}
                        savingFileCallback = {this.props.savingFileCallback}
                        addExtraBlkCallback = {this.props.addExtraBlkCallback}
                        savingDataFileCallback = {this.props.savingDataFileCallback}/>
                </div>
                <Dialog open={this.state.showExampleDataDialog} onClose={this.handleExampleDataDialogClose}>
                    <DialogTitle>Example Data</DialogTitle>
                    <DialogContent>
                        <div onClick={()=> this.openExampleData("personality")} className="exampleDataSelection">
                            <b>Personality</b><br/>
                            <span>Simulated data on Big 5 personality traits, mental health and sex</span>
                            <br/><br/>
                        </div>
                        <div onClick={()=> this.openExampleData("cancer")} className="exampleDataSelection">
                            <b>Lung Cancer</b><br/>
                            <span>Simulated data on lung cancer remission</span>
                            <br/><br/>
                        </div>
                        <div onClick={()=> this.openExampleData("TitanicSurvival")} className="exampleDataSelection">
                            <b>Titanic Survival</b><br/>
                            <span>Information on the survival status in the Titanic disaster of 1912</span>
                            <br/><br/>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <StyledButton onClick={() => this.handleExampleDataDialogClose()}>CANCEL</StyledButton>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}