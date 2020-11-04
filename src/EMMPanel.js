import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import {VariableSelectionList} from './VariableSelectionList';
import Button from '@material-ui/core/Button';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { withStyles } from '@material-ui/core/styles';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import Checkbox from '@material-ui/core/Checkbox';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';


const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);

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

export class EMMPanel extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            arrowDelBtn: "arrow"
        }
    }

    genVariableSelectionList = (targetVarList, targetCheckedList, needTypeIcon) => {
        return (
            <VariableSelectionList key={targetVarList} VariableList = {this.props.Variables[targetVarList]}
                        checkedList = {this.props.Checked[targetCheckedList]}
                        handleToggleCallback = {this.props.handleToggleCallback} 
                        listType = {targetCheckedList}
                        CurrentVariableList = {this.props.CurrentVariableList}
                        addExtraBlkCallback = {this.props.addExtraBlkCallback}
                        needTypeIcon = {needTypeIcon}/>
        )
    }

    genInteractionArrowButton = () => {
        return (
            <>
            <StyledButton disableRipple hidden={this.state.arrowDelBtn !== "arrow"}
            onClick = {() => this.props.addEMMTermCallback()}> 
                <FontAwesomeIcon icon={faArrowRight}/>
            </StyledButton>
            <StyledButton disableRipple hidden={this.state.arrowDelBtn !== "del"}
            onClick = {() => this.props.delEMMTermCallback()}> 
                <FontAwesomeIcon icon={faTrashAlt}/>
            </StyledButton>
            </>
        )
    }

    render () {
        return (
            
            <div className="analysis-pane">
                <div className="EMM-Variable-Selection-Box" hidden={(this.props.AnalysisSetting[this.props.currentActiveAnalysisPanel].robustReg || 
                    this.props.Variables.Weight.length > 0)}>
                    <div>Marginal Means
                    <StyledTooltip title={<div>Categorical variables: Marginal means of the outcome for each level of the target categorical variable will be computed. <br/><br/> 
                    Numeric variables: Marginal means of the outcome will be calculated at the mean and +/- 1 SD of the target numeric variable.<br/><br/>Estimated Marginal Means are not available for robust regression.</div>}>
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                    </div>
                    <div></div>
                    <div onClick={() => this.setState({arrowDelBtn: "arrow"})}>
                        <VariableSelectionList VariableList = {this.props.availableVarsEMM}
                            checkedList = {this.props.CovariatesEMMSelection}
                            handleToggleCallback = {this.props.handleToggleCallback} 
                            listType = {"CovariatesEMMSelection"}
                            CurrentVariableList = {null}
                            addExtraBlkCallback = {null}
                            needTypeIcon = {false}/>
                    </div>
                    <div>
                        <div className="NMACheckbox" hidden = {this.props.currentActiveAnalysisPanel === "ANOVAPanel"}><Checkbox size="small"
                            checked = {this.props.AnalysisSetting["EMMResponseScale"]}
                            onClick={(event) => this.props.updateAnalysisSettingCallback(event, "EMMPanel","EMMResponseScale")}/>Marginal means in response scale
                            <StyledTooltip title="For logistic and multinomial logistic regression model, show marginal means in terms of probability.
                            For Poisson and negative binomial model, show marginal means in terms of count.">
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                        </div>
                        <div className="NMACheckbox"><Checkbox size="small"
                            checked = {this.props.AnalysisSetting["Pairwise"]}
                            onClick={(event) => this.props.updateAnalysisSettingCallback(event, "EMMPanel","Pairwise")}
                            />Pairwise comparison
                        </div>
                        <div className="NMACheckbox" hidden = {this.props.currentActiveAnalysisPanel === "ANOVAPanel"}><Checkbox size="small"
                            checked = {this.props.AnalysisSetting["SimpleSlope"]}
                            onClick={(event) => this.props.updateAnalysisSettingCallback(event, "EMMPanel","SimpleSlope")}
                            />Test for simple slope
                            <StyledTooltip title="If the first variable in the interaction in a numeric variable, its slope will be tested across different levels of other variables in the interaction.">
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                        </div>
                        <div className="NMACheckbox"><Checkbox size="small"
                            checked = {this.props.AnalysisSetting["InteractionPlot"]}
                            onClick={(event) => this.props.updateAnalysisSettingCallback(event, "EMMPanel","InteractionPlot")}
                            />Interaction plot
                            <StyledTooltip title="Interaction plot for two or three-way interaction. The first variable in the interaction term will go to the horizontal axis, the second variable will be shown using different color of lines and the third will be shown in different panels.">
                            <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip>
                        </div>
                    </div>
                </div>
                <div className="p-2" hidden={(!(this.props.AnalysisSetting[this.props.currentActiveAnalysisPanel].robustReg ||
                    this.props.Variables.Weight.length > 0))}>
                    <FontAwesomeIcon icon={faExclamationTriangle} size="1x"/><span className="pl-2">Estimated Marginal Means are not available for robust regression and weighted analysis.</span>
                </div>
            </div>
        )
    }
}