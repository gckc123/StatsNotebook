import React, {Component } from 'react';
import "./AnalysisPanelElements.css";
import IconButton from '@material-ui/core/IconButton';
import BarChartIcon from '@material-ui/icons/BarChart';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';
import {withStyles} from '@material-ui/core';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PieChartIcon from '@material-ui/icons/PieChart';
import DensityIcon from "./icon/DensityOrange.svg";

const OrangeIconButton = withStyles({
    root: {
        '&:focus': {
            outline: 'none',
        },
        color: "orange",
    },
})(IconButton);


const MenuItemStyle = {
    fontSize: 'small',
}

class ChangeVariableTypeMenu extends Component {

    changeVariableType = (targetType) => {
        let script = ""
        if (targetType === "numeric" || targetType === "character") {
            script = "currentDataset$" + this.props.targetVar + " <- as." + targetType + "(currentDataset$" + this.props.targetVar + ")"
        }else {
            script = "currentDataset$" + this.props.targetVar + " <- " + targetType + "(currentDataset$" + this.props.targetVar +", exclude = c(\"\", NA))"    
        }
        this.props.addExtraBlkCallback(script, true)
        this.props.handleClose()
    }

    render () {
        let open= Boolean(this.props.anchorEl)
        return (
            <Menu anchorEl={this.props.anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin ={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={open}
                onClose={this.props.handleClose}>
                <MenuItem onClick={() => this.changeVariableType("numeric")} disableRipple style={MenuItemStyle}
                disabled = {this.props.disableItem === "Numeric"}>
                <BarChartIcon style={{color: "orange", paddingRight: "2px"}}/>Numeric</MenuItem>
                <MenuItem onClick={() => this.changeVariableType("factor")} disableRipple style={MenuItemStyle}
                disabled = {this.props.disableItem === "Factor"}>
                <PieChartIcon style={{color: "orange", paddingRight: "2px"}}/>
                Categorical (Factor)</MenuItem>
                <MenuItem onClick={() => this.changeVariableType("character")} disableRipple style={MenuItemStyle}
                disabled = {this.props.disableItem === "Character"}>
                <TextRotationNoneIcon style={{color: "orange", paddingRight: "2px"}}/>
                Text (Character)</MenuItem>
            </Menu>
        )
    }
}

export class VariableTypeIcon extends Component {   
    
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        }
    }

    handleMenu = (event) => {
        this.setState({anchorEl: event.currentTarget})
    }

    handleClose = (event) => {
        this.setState({anchorEl: null})
    }

    render () {
        //The first line is needed because of updating pitfall
        //CurrentVariableList is updated but the Variable list is not!
        //This probably will not be necessary if the codes in MdeiationPanel is rewritten 
        //so that the array Available/Outcome/Exposure/Mediator/Covariates now contain information
        //about the variable type.
        if (Object.keys(this.props.CurrentVariableList).indexOf(this.props.targetVar) !== -1) {
            if (this.props.CurrentVariableList[this.props.targetVar][0] === "Numeric") {
            
                return (
                    <>
                    <OrangeIconButton key={this.props.targetVar} edge="end" disableRipple size="small" onClick={this.handleMenu}>
                        <img src={DensityIcon} alt="" height="20px"/>
                    </OrangeIconButton>
                    <ChangeVariableTypeMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                    disableItem = "Numeric"
                    addExtraBlkCallback = {this.props.addExtraBlkCallback}
                    targetVar = {this.props.targetVar}/>
                    </>
                )
            }
            if (this.props.CurrentVariableList[this.props.targetVar][0] === "Factor") {
                return (
                    <>
                    <OrangeIconButton key={this.props.targetVar} edge="end" disableRipple size="small" onClick={this.handleMenu}>
                        <PieChartIcon fontSize="small"/>
                    </OrangeIconButton>
                    <ChangeVariableTypeMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                    disableItem = "Factor"
                    addExtraBlkCallback = {this.props.addExtraBlkCallback}
                    targetVar = {this.props.targetVar}/>
                    </>
                )
            }
            if (this.props.CurrentVariableList[this.props.targetVar][0] === "Character") {
                return (
                    <>
                    <OrangeIconButton key={this.props.targetVar} edge="end" disableRipple size="small" onClick={this.handleMenu}>
                        <TextRotationNoneIcon fontSize="small"/>
                    </OrangeIconButton>
                    <ChangeVariableTypeMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                    disableItem = "Character"
                    addExtraBlkCallback = {this.props.addExtraBlkCallback}
                    targetVar = {this.props.targetVar}/>
                    </>
                )
            }
        }
        return null
    }
}