import React, {Component } from 'react';
import {List} from 'react-virtualized';
import {AutoSizer} from 'react-virtualized';
import "./AnalysisPanelElements.css";

import {VariableTypeIcon} from "./VariableTypeIcon"



export class VariableSelectionList extends Component {


    _rowRenderer = ({index, key, style}) => {
        return (
        <div key={key} style = {{...style}} className={this.props.needTypeIcon ? "VariableListRow3Items" : "VariableListRow2Items"}>

            <div>
                <label className="VariableListCheckbox">
                    <input onChange={() => this.props.handleToggleCallback(this.props.VariableList[index],this.props.listType)}
                    type="checkbox" checked={this.props.checkedList.indexOf(this.props.VariableList[index]) !== -1}/>
                </label>
            </div>
                
            <div className="VariableListText" onClick={() => this.props.handleToggleCallback(this.props.VariableList[index],this.props.listType)}>
                {this.props.VariableList[index]}</div>       

            {this.props.needTypeIcon &&
                <div>
                    <VariableTypeIcon CurrentVariableList = {this.props.CurrentVariableList}
                        targetVar = {this.props.VariableList[index]} 
                        addExtraBlkCallback = {this.props.addExtraBlkCallback}/>
                </div>
            }

        </div>
        )

    }

    render () {
        return (
            <AutoSizer>
            {({width, height}) => {
            return (
                <List 
                    style={{border: "1px solid #e8e8e8"}}
                    {...this.props}
                    width = {width}
                    height = {height}
                    rowCount = {this.props.VariableList.length}
                    rowHeight= {25}
                    rowRenderer = {this._rowRenderer}

                />)}
            }
            </AutoSizer>
        )
    }
}