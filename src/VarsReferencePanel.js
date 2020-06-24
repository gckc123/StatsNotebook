import React, {Component} from 'react';
import {VariableTypeIcon} from './VariableTypeIcon'
import {MultiGrid} from 'react-virtualized';
import './App.css';
import Tooltip from '@material-ui/core/Tooltip';
import {withStyles, FormControl} from '@material-ui/core';
import NativeSelect from '@material-ui/core/NativeSelect';


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

const StyledTooltip = withStyles({
  tooltip: {
    fontSize: "12px"
  }
})(Tooltip);


const StyledNativeSelect = withStyles({
  root: {
      '&:focus': {
          outline: 'none',
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

export class VarsReferencePanel extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      fixedColumnCount: 0,
      fixedRowCount: 1,
      scrollToColumn: 0,
      scrollToRow: 0,
    };
  }

  setReferenceLevel = (event, target) => {
    let script = "currentDataset$" + target + " <- " + "relevel(currentDataset$" + target +", ref=\"" + event.target.value + "\")"
    this.props.addExtraBlkCallback(script, true)
  }

  //potential bugs here - might need to account for the wide of border? Not 100% sure....

  _cellRenderer = ({columnIndex, key, rowIndex, style}) => {
    
    let customStyle = {...style}    
    
    let textLineHeight = customStyle["height"]+"px"
    
    customStyle = {...customStyle, borderLeft: '1px solid #e8e8e8', overflow: "hidden", 
    textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "14px", paddingLeft: "3px"}
    if (rowIndex%2 === 0) {
      customStyle = {...customStyle, background: "#f1f1f1"}
    }else{
      customStyle = {...customStyle, background: "white"}
    }

    //Table heading
    if (rowIndex === 0)
    {
      let heading = ""
      switch (columnIndex) {
        case 0:
          heading = "Variable";
          break;
        case 1:
          heading = "Current Reference Level";
          break;
        case 2:
          heading = "Update Reference Level"
          break;
        default:
          break;
      }
      return (
        <div key={key} style={customStyle}>
          <span style={{lineHeight: textLineHeight}}>{heading}</span>
        </div>
      )
    }else{
    //content
      if (columnIndex == 0) {
        return (
          <div key={key} style={customStyle}>
            <span style={{lineHeight: textLineHeight}}>{Object.keys(this.props.CategoricalVarLevels)[rowIndex-1]}</span>
          </div>
        )
      }else if (columnIndex == 1) {
        return (
          <div key={key} style={customStyle}>
            <span style={{lineHeight: textLineHeight}}>{this.props.CategoricalVarLevels[Object.keys(this.props.CategoricalVarLevels)[rowIndex-1]][0]}</span>
          </div>
        )
      }else if (columnIndex == 2) {
        return (
          <div key={key} style={{...customStyle,lineHeight: textLineHeight}}>
            
              <select style={{width: "200px"}} onChange={(event) => this.setReferenceLevel(event,Object.keys(this.props.CategoricalVarLevels)[rowIndex-1])}>
                <option value="">- New Reference Level -</option>
                {
                  
                  this.props.CategoricalVarLevels[Object.keys(this.props.CategoricalVarLevels)[rowIndex-1]].map( (levels, index) => {
                      return (
                        <option value={levels} key={levels}>{levels}</option>
                      )
                    }
                  )
                }
              </select>
            
          </div>
        )
      }
    }
  }
  

  render () {
    
    return (
            <MultiGrid
              {...this.state}
              {...this.props}
              cellRenderer={this._cellRenderer}
              columnWidth={210}
              columnCount={3}
              enableFixedColumnScroll
              enableFixedRowScroll
              height={this.props.dataPanelHeight}
              rowHeight={28}
              rowCount={this.props.nrow}
              style={STYLE}
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
