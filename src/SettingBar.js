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

    render () {
        return (
            <div className="app-bar">
                <StyledButton disableRipple onClick={this.props.newNotebookCallback}>
                    <FontAwesomeIcon icon={faFile}/><div className='ml-1'>New</div>
                </StyledButton>
                <StyledButton disableRipple onClick={this.handleMenu}>
                    <FontAwesomeIcon icon={faFolderOpen} /><div className='ml-1'>Open</div>                    
                </StyledButton>
                <OpenFileMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                    openFileCallback = {this.props.openFileCallback}/>
                <StyledButton disableRipple onClick={this.handleSaveMenu}>
                    <FontAwesomeIcon icon={faSave}/><div className='ml-1'>Save</div>
                </StyledButton>
                <SaveFileMenu handleClose = {this.handleSaveClose} anchorEl = {this.state.anchorSaveMenu}
                    savingFileCallback = {this.props.savingFileCallback}
                    addExtraBlkCallback = {this.props.addExtraBlkCallback}
                    savingDataFileCallback = {this.props.savingDataFileCallback}/>
            </div>
        )
    }
}