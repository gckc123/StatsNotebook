import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import "./App.css";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import BoxplotIcon from "./icon/boxplot.svg";
import RegressionIcon from "./icon/regression.svg";
import MediationIcon from "./icon/Mediation.svg";
import MissingDataIcon from "./icon/missingdata.svg";
import MetaAnalysisIcon from "./icon/Meta_analysis.svg";
import HistogramIcon from "./icon/histogram.svg";
import RobotIcon from "./icon/robot.svg";



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
        flexDirection: 'column',
     } , 

})(Button);

const MenuItemStyle = {
    fontSize: 'small',
}

class LineAreaMenu extends Component {

    setDataVizPanel = (target) => {
        this.props.selectDataVizPanelCallback(target)
        this.props.handleClose()
    }

    render() {
        let open = Boolean(this.props.anchorEl[this.props.target])
        return (
            <Menu anchorEl={this.props.anchorEl[this.props.target]}
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
                <MenuItem disableRipple style = {MenuItemStyle}>Line graph</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick={() => this.setDataVizPanel("MediationPanel")}>Area graph</MenuItem>                                       
            </Menu>
        )
    }
}

class NumericMenu extends Component {

    setDataVizPanel = (target) => {
        this.props.selectDataVizPanelCallback(target)
        this.props.handleClose()
    }

    render() {
        let open = Boolean(this.props.anchorEl[this.props.target])
        return (
            <Menu anchorEl={this.props.anchorEl[this.props.target]}
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
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick={() => this.setDataVizPanel("DensityPanel")}>Density</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick={() => this.setDataVizPanel("HistogramPanel")}>Histogram</MenuItem>                                 
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick={() => this.setDataVizPanel("BoxplotPanel")}>Boxplot</MenuItem>
            </Menu>
        )
    }
}

class CategoricalMenu extends Component {

    setDataVizPanel = (target) => {
        this.props.selectDataVizPanelCallback(target)
        this.props.handleClose()
    }

    render() {
        let open = Boolean(this.props.anchorEl[this.props.target])
        return (
            <Menu anchorEl={this.props.anchorEl[this.props.target]}
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
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick={() => this.setDataVizPanel("LineChartPanel")}>Line chart</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick={() => this.setDataVizPanel("AreaChartPanel")}>Area chart</MenuItem>                                       
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick={() => this.setDataVizPanel("TimeSeriesPanel")}>Time series</MenuItem>
            </Menu>
        )
    }
}

class CorrelationMenu extends Component {

    setDataVizPanel = (target) => {
        this.props.selectDataVizPanelCallback(target)
        this.props.handleClose()
    }

    render() {
        let open = Boolean(this.props.anchorEl[this.props.target])
        return (
            <Menu anchorEl={this.props.anchorEl[this.props.target]}
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
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick={() => this.setDataVizPanel("ScatterplotPanel")}>Scatterplot</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick={() => this.setDataVizPanel("CorrelogramPanel")}>Correlogram</MenuItem>                                       
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick={() => this.setDataVizPanel("ContourPanel")}>Contour plot</MenuItem>
            </Menu>
        )
    }
}

export class DataVizBar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: {
                linearea: null,
                numeric: null,
                categorical: null,
                correlation: null,
            }
        }
    }

    handleMenu = (event, target) => {
        let tmp = {...this.state.anchorEl}
        tmp[target] = event.currentTarget
        this.setState({anchorEl: {...tmp}})
        
    }

    handleClose = (event) => {
        let tmp = {...this.state.anchorEl}
        for (let key in tmp) {
            tmp[key] = null
        }
        this.setState({anchorEl: {...tmp}})
    }

    render () {
        return (
            <div className="app-bar">
                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "numeric")}>
                <img src={HistogramIcon} alt="" height="38px"/>
                <div style={{fontSize: "12px"}}>Numeric</div>
                </StyledButton>
                <NumericMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                target = "numeric" selectDataVizPanelCallback={this.props.selectDataVizPanelCallback}/>

                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "categorical")}>
                <img src={BoxplotIcon} alt="" height="38px"/>
                <div style={{fontSize: "12px"}}>Categorical</div>
                </StyledButton>
                <CategoricalMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                target = "categorical" selectDataVizPanelCallback={this.props.selectDataVizPanelCallback}/>
                
                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "correlation")}>
                <img src={MediationIcon} alt="" height="38px"/>
                <div style={{fontSize: "12px"}}>Correlation</div>
                </StyledButton>                
                <CorrelationMenu handleClose ={this.handleClose} anchorEl = {this.state.anchorEl}
                target = "correlation" selectDataVizPanelCallback={this.props.selectDataVizPanelCallback}/>

                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "linearea")}>
                <img src={MediationIcon} alt="" height="38px"/>
                <div style={{fontSize: "12px"}}>Line/Area</div>
                </StyledButton>                
                <LineAreaMenu handleClose ={this.handleClose} anchorEl = {this.state.anchorEl}
                target = "linearea" selectDataVizPanelCallback={this.props.selectDataVizPanelCallback}/>
                
            </div>
        )
    }
}