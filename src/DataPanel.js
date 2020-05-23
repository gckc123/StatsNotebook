import React, {Component} from 'react';
import {AutoSizer} from 'react-virtualized';
import {MultiGrid} from 'react-virtualized';
import './App.css';

const STYLE = {
  border: '1px solid #ddd',
  '&:focus': {
    color: '#40a9ff',
    outline: 'none',
  },
};
const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7',
  '&:focus': {
    color: '#40a9ff',
    outline: 'none',
  },
};
const STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold',
  '&:focus': {
    color: '#40a9ff',
    outline: 'none',
  },
};
const STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold',
  '&:focus': {
    color: '#40a9ff',
    outline: 'none',
  },
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

  _cellRenderer = ({columnIndex, key, rowIndex, style}) => {
    
    let variableName = Object.keys(this.props.CurrentVariableList);

    return (
      <div key={key} style={style}>
        {variableName[columnIndex]}
      </div>
    );
  }
  
  testing = (cOStartI,cOStopI,cSI,rOSI) => {
    console.log(cOStartI)
  }
  render () {
    return (
      <div>
        Hahaha
        <AutoSizer disableHeight>
          {({width}) => (
            <MultiGrid
              {...this.state}
              cellRenderer={this._cellRenderer}
              columnWidth={100}
              columnCount={100}
              enableFixedColumnScroll
              enableFixedRowScroll
              height={500}
              rowHeight={25}
              rowCount={300}
              style={STYLE}
              onSectionRendered={this.testing}
              styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
              styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
              styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
              width={width}
              hideTopRightGridScrollbar
              hideBottomLeftGridScrollbar
            />
          )}
        </AutoSizer>
        
      </div>
    )
  }
}
