import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import "./App.css";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

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
     }   
})(Button);

const MenuItemStyle = {
    fontSize: 'small',
}


class RegressionMenu extends Component {

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
                <MenuItem disableRipple style = {MenuItemStyle}>Regression (Continuous outcome)</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}>Binary logistic regression (Binary outcome)</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}>Ordinal logistic regression (Ordinal outcome)</MenuItem>
                <MenuItem disableRipple style = {MenuItemStyle}>Multinomial logistic regression (Categorical outcome)</MenuItem>                        
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
            }
        }
    }

    handleMenu = (event, target) => {
        let tmp = {...this.state.anchorEl}
        tmp[target] = event.currentTarget
        this.setState({anchorEl: {...tmp}}, ()=>console.log(this.state.anchorEl[target]))
        
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
                <ChangeHistoryIcon/><div className='ml-1'>Explore</div>
                </StyledButton>
                <ExploreMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                target = "explore"/>

                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "mean")}>
                <ChangeHistoryIcon/><div className='ml-1'>Compare Means</div>
                </StyledButton>
                <MeanMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                target = "mean"/>
                
                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "causal")}>
                <ChangeHistoryIcon/><div className='ml-1'>Causal</div>
                </StyledButton>                
                <CausalMenu handleClose ={this.handleClose} anchorEl = {this.state.anchorEl}
                target = "causal" selectAnalysisPanelCallback={this.props.selectAnalysisPanelCallback}/>
                
                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "regression")}>
                <ChangeHistoryIcon/><div className='ml-1'>Regression</div>
                </StyledButton>
                <RegressionMenu handleClose = {this.handleClose} anchorEl = {this.state.anchorEl}
                target = "regression"/>
                
                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "regression")}>
                <ChangeHistoryIcon/><div className='ml-1'>Mixed Models</div>
                </StyledButton>

                <StyledButton disableRipple onClick={(event) => this.handleMenu(event, "regression")}>
                <ChangeHistoryIcon/><div className='ml-1'>Imputation</div>
                </StyledButton>

            </div>
        )
    }
}