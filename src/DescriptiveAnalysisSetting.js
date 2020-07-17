import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Checkbox from '@material-ui/core/Checkbox';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';

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
})(IconButton);

const StyledNativeSelect = withStyles({
    root: {
        '&:focus': {
            outline: 'none',
            background: 'white',
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
  
export class DescriptiveAnalysisSetting extends Component {
    
    render () {
        return (
            <div>
                <div><b>Statistics</b></div>
                <div className="Descriptive-Analysis-Box-3">
                    <div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Mean} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Mean")}/>Mean</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Median} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Median")}/>Median</div>
                    </div>
                    <div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.SD} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"SD")}/>SD</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Variance} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Variance")}/>Variance</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.IQR} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"IQR")}/>IQR</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Q2575} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Q2575")}/>25th/75th percentile</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.MaxMin} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"MaxMin")}/>Max/Min</div>
                    </div>
                    <div>
                    <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Skewness} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Skewness")}/>Skewness</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Kurtosis} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Kurtosis")}/>Kurtosis</div>
                    </div>
                </div>
                
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Normality} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Normality")}/>Normality test for numeric variables
                        <StyledTooltip title="Shapiro-Wilk test will be used. Normality test is not recommended for a large sample because even a small deviation from normality will result in a small p-value.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.QQPlot} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"QQPlot")}/>QQ Plot for numeric variables
                        <StyledTooltip title="Data can be assumed normal if the points roughtly follow a 45 degree straight line.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.CorrelationMatrix} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"CorrelationMatrix")}/>Correlation Matrix for numeric variables</div>
                
                <Divider className="mt-2 mb-2"/>
                <div><b>Plots</b></div>
                <div className="Descriptive-Analysis-Box-2">
                    <div>
                        <div>Numeric variables</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Histogram} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Histogram")}/>Histogram</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Density} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Density")}/>Density</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Boxplot} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Boxplot")}/>Boxplot</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.ScatterplotMatrix} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ScatterplotMatrix")}/>Scatterplot Matrix</div>
                        
                    </div>
                    <div>
                        <div>Categorical variables</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.BarChart} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"BarChart")}/>Bar Chart</div>
                    </div>
                </div>
                <Divider className="mt-2 mb-2"/>
                

            </div>
        )
    }
}