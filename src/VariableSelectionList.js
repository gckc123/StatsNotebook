import React, {Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import "./AnalysisPanelElements.css";

export class VariableSelectionList extends Component {
 
    render () {
        return (
            <List dense className={`${this.props.listType}VariableList`}>
                
                {
                    this.props.VariableList.map((variable, index) => {
                        return (
                            <ListItem key={variable} button className="VariableListItem" 
                                onClick={() => this.props.handleToggleCallback(variable,this.props.listType)}>
                                <ListItemIcon>
                                    <Checkbox checked={this.props.checkedList.indexOf(variable) !== -1} size="small" />
                                </ListItemIcon>
                                <ListItemText primary={<div className="VariableListText">{variable}</div>} />
                            </ListItem>
                        )
                    })
                }         
            </List>
        )
    }
}