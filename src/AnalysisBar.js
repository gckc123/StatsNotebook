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

class MachineLearningMenu extends Component {
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
                <MenuItem disableRipple style = {MenuItemStyle}>Super Learner</MenuItem>
            </Menu>
        )
    }
}

class ImputationMenu extends Component {

    setAnalysisPanel = (target) => {
        this.props.selectAnalysisPanelCallback(target)
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
                onClick={() => this.setAnalysisPanel("MIPanel")}>Multiple Imputation</MenuItem>
            </Menu>
        )
    }
}


class MetaAnalysisMenu extends Component {

    setAnalysisPanel = (target) => {
        this.props.selectAnalysisPanelCallback(target)
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
                onClick = {() => this.setAnalysisPanel("MAPanel")}>Meta-Analysis/ Meta-Regression</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick = {() => this.setAnalysisPanel("NMAPanel")}>Network Meta-Analysis</MenuItem>
            </Menu>
        )
    }
}

class RegressionMenu extends Component {

    setAnalysisPanel = (target) => {
        this.props.selectAnalysisPanelCallback(target)
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
                onClick = {() => this.setAnalysisPanel("LRPanel")}>Linear Regression (For numeric outcome)</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick = {() => this.setAnalysisPanel("LogitPanel")}>Logistic Regression (For binary outcome)</MenuItem>                        
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick = {() => this.setAnalysisPanel("PoiPanel")}>Poisson Regression (For count outcome)</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick = {() => this.setAnalysisPanel("MLRPanel")}>Multinomial logistic Regression (For categorical outcome with more than two levels)</MenuItem>
            </Menu>
        )
    }
}

class CausalMenu extends Component {

    setAnalysisPanel = (target) => {
        this.props.selectAnalysisPanelCallback(target)
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
                <MenuItem disableRipple style = {MenuItemStyle}>Marginal Structural Models</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}
                onClick={() => this.setAnalysisPanel("MediationPanel")}>
                    Causal Mediation Analysis
                </MenuItem>                                       
            </Menu>
        )
    }
}

class ExploreMenu extends Component {

    setAnalysisPanel = (target) => {
        this.props.selectAnalysisPanelCallback(target)
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
                <MenuItem disableRipple style = {MenuItemStyle}>Descriptive statistics</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}>
                    Frequency
                </MenuItem>                                       
            </Menu>
        )
    }
}

class MeanMenu extends Component {

    setAnalysisPanel = (target) => {
        this.props.selectAnalysisPanelCallback(target)
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
                <MenuItem disableRipple style = {MenuItemStyle}>Independent sample T-test</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}>Repeated measure T-test</MenuItem>                                       
                <MenuItem disableRipple style = {MenuItemStyle}>ANOVA</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}>ANCOVA</MenuItem>
            </Menu>
        )
    }
}

export class AnalysisBar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: {
                regression: null,
                causal: null,
                explore: null,
                mean: null,
                metaanalysis: null,
                imputation: null,
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
                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "explore")}>
                <img src={HistogramIcon} alt="" height="38px"/>
                <div style={{fontSize: "12px"}}>Explore</div>
                </StyledButton>
                <ExploreMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                target = "explore"/>

                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "mean")}>
                <img src={BoxplotIcon} alt="" height="38px"/>
                <div style={{fontSize: "12px"}}>Means</div>
                </StyledButton>
                <MeanMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                target = "mean"/>
                
                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "causal")}>
                <img src={MediationIcon} alt="" height="38px"/>
                <div style={{fontSize: "12px"}}>Causal</div>
                </StyledButton>                
                <CausalMenu handleClose ={this.handleClose} anchorEl = {this.state.anchorEl}
                target = "causal" selectAnalysisPanelCallback={this.props.selectAnalysisPanelCallback}/>
                
                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "regression")}>
                <img src={RegressionIcon} alt="" height="38px"/>
                <div style={{fontSize: "12px"}}>Regression</div>
                </StyledButton>
                <RegressionMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                target = "regression" selectAnalysisPanelCallback={this.props.selectAnalysisPanelCallback}/>
                
                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "metaanalysis")}>
                <img src={MetaAnalysisIcon} alt="" height="38px"/>
                <div style={{fontSize: "12px"}}>Meta-Analysis</div>
                </StyledButton>
                <MetaAnalysisMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                target = "metaanalysis" selectAnalysisPanelCallback={this.props.selectAnalysisPanelCallback}/>

                <StyledButton disableRipple onClick={(event) => 
                    {
                        this.props.getCPUCountCallback()
                        this.handleMenu(event, "imputation")
                    }
                }>
                <img src={MissingDataIcon} alt="" height="38px" />
                <div style={{fontSize: "12px"}}>Imputation</div>
                </StyledButton>
                <ImputationMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                target = "imputation" selectAnalysisPanelCallback={this.props.selectAnalysisPanelCallback}/>

                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "machinelearning")}>
                <img src={RobotIcon} alt="" height="38px" />
                <div style={{fontSize: "12px"}}>Learning</div>
                </StyledButton>
                <MachineLearningMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                target = "machinelearning"/>

            </div>
        )
    }
}