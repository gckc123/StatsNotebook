import React, {Component } from 'react';
import "./AnalysisPanelElements.css";
import IconButton from '@material-ui/core/IconButton';
import BarChartIcon from '@material-ui/icons/BarChart';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';
import {withStyles} from '@material-ui/core';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PieChartIcon from '@material-ui/icons/PieChart';

const OrangeIconButton = withStyles({
    root: {
        '&:focus': {
            outline: 'none',
        },
        color: "orange",
    },
})(IconButton);

const StyledMenuItem = withStyles({
    textTransform: 'none',  
    fontSize: 'small',
    '&:hover': {
        color: '#40a9ff',
        opacity: 1,
    },
    '&$selected': {
        color: '#1890ff',
    },
})(MenuItem);

class ChangeVariableTypeMenu extends Component {
    render () {
        let open= Boolean(this.props.anchorEl)
        return (
            <Menu anchorEl={this.props.anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin ={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={this.props.handleClose}>
                <StyledMenuItem onClick={this.props.handleClose} disableRipple>Quantitative</StyledMenuItem>
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
                    <OrangeIconButton key={this.props.targetVar} edge="end" disableRipple size="small">
                        <BarChartIcon />
                    </OrangeIconButton>
                    </>
                )
            }
            if (this.props.CurrentVariableList[this.props.targetVar][0] === "Factor") {
                return (
                    <>
                    <OrangeIconButton key={this.props.targetVar} edge="end" disableRipple size="small">
                        <PieChartIcon />
                    </OrangeIconButton>
                    </>
                )
            }
            if (this.props.CurrentVariableList[this.props.targetVar][0] === "Character") {
                return (
                    <>
                    <OrangeIconButton key={this.props.targetVar} edge="end" disableRipple size="small">
                        <TextRotationNoneIcon />
                    </OrangeIconButton>
                    </>
                )
            }
        }
        return null
    }
}