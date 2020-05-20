import React, {Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import "./AnalysisPanelElements.css";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import BarChartIcon from '@material-ui/icons/BarChart';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';
import {withStyles} from '@material-ui/core';
import {faChartPie} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const OrangeIconButton = withStyles({
    root: {
        '&:focus': {
            outline: 'none',
        },
        color: "orange",
    },
})(IconButton);

class VariableTypeIcon extends Component {
    
    render () {
        //The first line is needed because of updating pitfall
        //CurrentVariableList is updated but the Variable list is not!
        //This probably will not be necessary if the codes in MdeiationPanel is rewritten 
        //so that the array Available/Outcome/Exposure/Mediator/Covariates now contain information
        //about the variable type.
        if (Object.keys(this.props.CurrentVariableList).indexOf(this.props.targetVar) !== -1) {
            if (this.props.CurrentVariableList[this.props.targetVar][0] === "Numeric") {
            
                return (
                    <OrangeIconButton edge="end" disableRipple size="small">
                        <BarChartIcon />
                    </OrangeIconButton>
                )
            }
            if (this.props.CurrentVariableList[this.props.targetVar][0] === "Factor") {
                return (
                    <OrangeIconButton edge="end" disableRipple size="small">
                        <FontAwesomeIcon icon={faChartPie} />
                    </OrangeIconButton>
                )
            }
            if (this.props.CurrentVariableList[this.props.targetVar][0] === "Character") {
                return (
                    <OrangeIconButton edge="end" disableRipple size="small">
                        <TextRotationNoneIcon />
                    </OrangeIconButton>
                )
            }
        }
        return null
    }
}

export class VariableSelectionList extends Component {

    render () {

        return (
            <List dense className={`${this.props.listType}VariableList`}>
                
                {
                    this.props.VariableList.map((variable, index) => {
 
                        return (
                            <ListItem button className="VariableListItem" 
                                onClick={() => this.props.handleToggleCallback(variable,this.props.listType)}>
                                <ListItemIcon>
                                    <Checkbox checked={this.props.checkedList.indexOf(variable) !== -1} size="small" />
                                </ListItemIcon>
                                <ListItemText primary={<div className="VariableListText">{variable}</div>} />
                                <ListItemSecondaryAction>                                    
                                <VariableTypeIcon CurrentVariableList = {this.props.CurrentVariableList}
                                        targetVar = {variable} />
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })
                }         
            </List>
        )
    }
}