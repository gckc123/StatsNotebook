import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuIcon from '@material-ui/icons/Menu';
import { SettingBar } from "./SettingBar";
import { DataBar } from "./DataBar";
import { AnalysisBar } from "./AnalysisBar";


const FirstTabs = withStyles({
    root: {
      borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
      backgroundColor: '#1890ff',
    },
  })(Tabs);

const FirstTab = withStyles((theme) => ({
    root: {
      textTransform: 'none',
      minWidth: 10,   
      fontWeight: theme.typography.fontWeightMedium,
      marginRight: theme.spacing(0),
      '&:hover': {
        color: '#40a9ff',
        opacity: 1,
      },
      '&$selected': {
        color: '#1890ff',
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: '#40a9ff',
        outline: 'none',
      },
      opacity: 1,
      
    },
    selected: {},
}))((props) => <Tab disableRipple {...props} />);


class TabPanel extends Component {
  render () {
    return (
      <div hidden={this.props.CurrentTab !== this.props.index}>
        {this.props.children}
      </div>
    )
  }
}

export class TopNavTabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      CurrentTab: 0,
    }
  }
    
  handleChange = (event, newValue) => {
      this.setState({CurrentTab: newValue});
      switch (newValue) {
        case 1:
          this.props.selectLeftPanelCallback("DataPanel")
          break;
        case 2:
          this.props.selectLeftPanelCallback("AnalysisPanel")
          break;
        default:
          this.props.selectLeftPanelCallback("")
          break;
      }

  };

  render () {
    
    return (
      <div>
        <FirstTabs value={this.state.CurrentTab} onChange={this.handleChange}>
          <FirstTab icon={<MenuIcon  fontSize="small" />}/>
          <FirstTab label="Data" />
          <FirstTab label="Analysis"/>            
        </FirstTabs>
        <TabPanel CurrentTab={this.state.CurrentTab} index={0}>
          <SettingBar openFileCallback = {this.props.openFileCallback}
          savingFileCallback = {this.props.savingFileCallback}/>
        </TabPanel>
        <TabPanel CurrentTab={this.state.CurrentTab} index={1}>
          <DataBar selectDataPanelCallback = {this.props.selectDataPanelCallback}/>
        </TabPanel>
        <TabPanel CurrentTab={this.state.CurrentTab} index={2}>
          <AnalysisBar selectAnalysisPanelCallback = {this.props.selectAnalysisPanelCallback}/>
        </TabPanel>               
      </div>
    )
  }
} 