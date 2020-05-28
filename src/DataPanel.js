import React, {Component} from 'react';
import {VariableTypeIcon} from './VariableTypeIcon'
import {MultiGrid} from 'react-virtualized';
import './App.css';

const STYLE = {
  border: '1px solid #ddd',
};

const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7',
};

const STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold',
};

const STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold',
};

export class DataPanel extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      fixedColumnCount: 0,
      fixedRowCount: 1,
      scrollToColumn: 0,
      scrollToRow: 0,
    };
  }

  //potential bugs here - might need to account for the wide of border? Not 100% sure....

  _cellRenderer = ({columnIndex, key, rowIndex, style}) => {
    
    let customStyle = {...style}    
    
    let textLineHeight = customStyle["height"]+"px"
    
    customStyle = {...customStyle, borderLeft: '1px solid #e8e8e8', overflow: "hidden", 
    textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "14px"}
    if (rowIndex%2 === 0) {
      customStyle = {...customStyle, background: "#f1f1f1"}
    }else{
      customStyle = {...customStyle, background: "white"}
    }
    let variableName = Object.keys(this.props.CurrentVariableList);
     
    if (rowIndex === 0) {
      return (
        <div key={key} style={customStyle}>
          <VariableTypeIcon CurrentVariableList = {this.props.CurrentVariableList}
          targetVar = {variableName[columnIndex]}
          addExtraBlkCallback = {this.props.addExtraBlkCallback}/>
          <span style={{paddingLeft: "2px"}}>{variableName[columnIndex]}</span>
        </div>
      )
    }else 
    {
      let dataValue = this.props.CurrentData[rowIndex-1][variableName[columnIndex]]
      return (
        <div key={key} style={{...customStyle, paddingLeft: "3px"}}>
          <span style={{lineHeight: textLineHeight}}>{dataValue}</span>
        </div>
      )
    };
  }
  

  render () {
    return (
            <MultiGrid
              {...this.state}
              {...this.props}
              cellRenderer={this._cellRenderer}
              columnWidth={100}
              columnCount={this.props.ncol}
              enableFixedColumnScroll
              enableFixedRowScroll
              height={this.props.dataPanelHeight}
              rowHeight={28}
              rowCount={this.props.nrow}
              style={STYLE}
              onSectionRendered={this.testing}
              styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
              styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
              styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
              width={this.props.dataPanelWidth}
              hideTopRightGridScrollbar
              hideBottomLeftGridScrollbar
            />
    )
  }
}
