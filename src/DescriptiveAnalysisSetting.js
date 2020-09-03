import React, {Component} from 'react';
import "./AnalysisPanelElements.css";
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Divider from '@material-ui/core/Divider';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';

const StyledTooltip = withStyles({
    tooltip: {
      fontSize: "12px"
    }
  })(Tooltip);

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
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"SD")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>SD</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Variance} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Variance")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Variance</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.IQR} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"IQR")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>IQR</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Q2575} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Q2575")}/>25th/75th percentile</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.MaxMin} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"MaxMin")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Max/Min</div>
                    </div>
                    <div>
                    <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Skewness} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Skewness")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Skewness</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Kurtosis} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Kurtosis")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Kurtosis</div>
                    </div>
                </div>
                
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Normality} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Normality")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Normality test for numeric variables
                        <StyledTooltip title="Shapiro-Wilk test will be used. Normality test is not recommended for a large sample because even a small deviation from normality will result in a small p-value.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.QQPlot} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"QQPlot")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>QQ Plot for numeric variables
                        <StyledTooltip title="Data can be assumed normal if the points roughtly follow a 45 degree straight line.">
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>
                <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.CorrelationMatrix} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"CorrelationMatrix")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Correlation Matrix for numeric variables</div>
                <div className="AnalysisSettingCheckBox pl-3" hidden = {!this.props.AnalysisSetting.CorrelationMatrix}><Checkbox checked = {this.props.AnalysisSetting.Spearman} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Spearman")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Spearman's Rho</div>
                
                <Divider className="mt-2 mb-2"/>
                <div><b>Plots</b></div>
                <div className="Descriptive-Analysis-Box-2">
                    <div>
                        <div>Numeric variables</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Histogram} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Histogram")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Histogram</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Density} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Density")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Density</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.Boxplot} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"Boxplot")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Boxplot</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.ScatterplotMatrix} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"ScatterplotMatrix")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Scatterplot Matrix</div>
                        
                    </div>
                    <div>
                        <div>Categorical variables</div>
                        <div className="AnalysisSettingCheckBox"><Checkbox checked = {this.props.AnalysisSetting.BarChart} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"BarChart")}
                        disabled= {this.props.Variables["Weight"].length > 0}/>Bar Chart</div>
                    </div>
                </div>
                <Divider className="mt-2 mb-2"/>
                <div className="AnalysisSettingCheckBox" hidden = {!this.props.imputedDataset}><Checkbox checked = {this.props.AnalysisSetting.OriginalData} size="small"
                        onClick= {(event) => this.props.updateAnalysisSettingCallback(event,"OriginalData")}/>Use original data
                        <StyledTooltip title={<div>For imputed dataset, the original data will be analyzed. Uncheck this to analyze the first imputed dataset.</div>}>
                        <span className="pl-2"><FontAwesomeIcon icon={faInfoCircle} size="1x"/></span></StyledTooltip></div>

            </div>
        )
    }
}