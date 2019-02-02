import React from 'react';
import axios from 'axios';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import DropDown from './UI/DropDown';
import Loading from './UI/Loading.js';
import { cloneDeep } from 'lodash';
import { format, getMonth, getYear } from 'date-fns';
import { ArcGauge } from '@progress/kendo-react-gauges';
import { Chart, ChartLegend, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem } from '@progress/kendo-react-charts';

let months = [{name:'ΙΑΝΟΥΑΡΙΟΣ',id:1},{name:'ΦΕΒΡΟΥΑΡΙΟΣ',id:2},{name:'ΜΑΡΤΙΟΣ',id:3},
            {name:'ΑΠΡΙΛΙΟΣ',id:4},{name:'ΜΑΙΟΣ',id:5},{name:'ΙΟΥΝΙΟΣ',id:6},
            {name:'ΙΟΥΛΙΟΣ',id:7},{name:'ΑΥΓΟΥΣΤΟΣ',id:8},{name:'ΣΕΠΤΕΜΒΡΙΟΣ',id:9},
            {name:'ΟΚΤΩΒΡΙΟΣ',id:10},{name:'ΝΟΕΜΒΡΙΟΣ',id:11},{name:'ΔΕΚΕΜΒΡΙΟΣ',id:12}];
let pieGross = [];
let pieNet = [];

class Summary extends React.Component{
    state={
        filter:{
            month:getMonth(new Date()),
            year:getYear(new Date())
        },
        loading:true,
        totalIncome:0,
        totalRemaining:0,
        netRemainingPercent:{},
        grossRemainingPercent:{}
    }

    componentDidMount(){
        //this.thisMonthPercent();
        //this.thisMonthRemanining();
        // this.getYearlyPercent();
    }

    thisMonthRemanining=()=>{
        axios.post('api/getMonthRemaining',{date:new Date(this.state.filter.year,this.state.filter.month,15)})
        .then(response=>{
            const totalIncome = response.data.totalIncome
            const totalRemaining = response.data.totalRemaining
            const arcValue = ((totalRemaining/totalIncome)*100).toFixed(1);
            this.setState({
                totalIncome,
                totalRemaining,
                arcValue,
                loading:false
            })
        })
    }
    
    thisMonthPercent=()=>{
        axios.post('api/getMonthPercents',{date:new Date(this.state.filter.year,this.state.filter.month,15)})
        .then(response=>{
            const netRemainingPercent = response.data.netSpentPercent
            const grossRemainingPercent = response.data.grossSpentPercent
            this.setState({
                netRemainingPercent,
                grossRemainingPercent
            })
            pieGross = [
                {category:'Αγορές',value:grossRemainingPercent.agoresGrossPercent},
                {category:'Αυτοκίνητο',value:grossRemainingPercent.autokinitoGrossPercent},
                {category:'Λογαριασμοί',value:grossRemainingPercent.logariasmoiGrossPercent},
                {category:'Υπόλοιπο',value:grossRemainingPercent.remainingGrossPercent},
                {category:'Supermarket',value:grossRemainingPercent.supermarketGrossPercent}          
            ];
            pieNet = [
                {category:'Αγορές',value:netRemainingPercent.agoresPercent},
                {category:'Αυτοκίνητο',value:netRemainingPercent.autokinitoPercent},
                {category:'Λογαριασμοί',value:netRemainingPercent.logariasmoiPercent},
                {category:'Supermarket',value:netRemainingPercent.supermarketPercent}          
            ];
        })
    }

    getYearlyPercent=()=>{
        axios.post('api/getYearlyData',{date:new Date()})
        .then(response=>{
            console.log('yearly')
            console.log(response.data)
        })
    }

    getCategories=()=>{
        axios.post('api/getMonthSupermarketCategories',{date:new Date()}).then(response=>{
          const freskaTotal = sumBy(response.data.data.monthlyFreska,'amount')
          const kreataTotal = sumBy(response.data.data.monthlyKreata,'amount')
          const xartiktaTotal = sumBy(response.data.data.monthlyXartika,'amount')
          const loipaTotal = sumBy(response.data.data.monthlyLoipa,'amount')
          const katharistikaTotal = sumBy(response.data.data.monthlyKatharistika,'amount')
          const trofimaTotal = sumBy(response.data.data.monthlyTrofima,'amount')
    
          this.setState({
            deptsMonthlyTotal : [
              {'ΦΡΕΣΚΑ' : freskaTotal},
              {'ΧΑΡΤΙΚΑ' : xartiktaTotal},
              {'ΚΑΘΑΡΙΣΤΙΚΑ' : katharistikaTotal},
              {'ΚΡΕΑΤΑ/ΨΑΡΙΑ' : kreataTotal},
              {'ΤΡΟΦΙΜΑ' :trofimaTotal},
              {'ΛΟΙΠΑ' :loipaTotal}
            ]
          })
        })
      }
      
    onChange=(e)=>{
        let temp = cloneDeep(this.state.filter);
        temp[e.target.props.name]=e.target.value;
        this.setState({
            filter:{...temp}
        });
    }
    render(){
        const colors = [
            { from: 0, to: 40, color: 'red' },
            { from: 40, to: 100, color: 'lime' }
        ];

        const arcOptions = {
            value: this.state.arcValue,
            colors
        };

        const arcCenterRenderer = (value, color) => {
            return (<h3 style={{ textAlign:'center', color: color }}>{value}%</h3>);
        };

        const {filter} = this.state;
        return(
            <div className='form-horizontal'>
                <div className="row">
                        <div className='col-lg-3 col-md-3'>
                        {!this.state.loading?
                            <article>
                                <header>
                                <h4>Απομένουν : {this.state.totalRemaining} €</h4>
                                </header>
                                <div className="row">
                                    
                                            <ArcGauge {...arcOptions} arcCenterRender={arcCenterRenderer}/>
                                    
                                </div>
                            </article>
                            :<Loading/>}
                        </div>
                        <div className='col-lg-4 col-md-4'>
                        {!this.state.loading?
                            <article>
                                <header>
                                <h4>Μεικτά Έξοδα</h4>
                                </header>
                                <div className="row">
                                    
                                        <Chart seriesColors={['#f14e43','#43baf1','#f1f143','#79fb5d','#fc84e8']}>
                                            <ChartLegend position="top" />
                                            <ChartSeries>
                                            <ChartSeriesItem type="pie" data={pieGross} field="value" categoryField="category" />
                                            </ChartSeries>
                                        </Chart>
                                    
                                </div>
                            </article>
                        :<Loading/>}
                        </div>
                        <div className='col-lg-4 col-md-4'>
                        {!this.state.loading?
                            <article>
                                <header>
                                <h4>Καθαρά Έξοδα</h4>
                                </header>
                                <div className="row">
                                    
                                        <Chart seriesColors={['#f14e43','#43baf1','#f1f143','#fc84e8']}>
                                            <ChartLegend position="top" />
                                            <ChartSeries>
                                            <ChartSeriesItem type="pie" data={pieNet} field="value" categoryField="category" />
                                            </ChartSeries>
                                        </Chart>
                                    
                                </div>
                            </article>
                        :<Loading/>}
                        </div>
                    </div>
                <div className="col-lg-12 col-md-12">
                    <div className="col-md-12 col-lg-12">
                        <div className="form-horizontal">
                            <article>
                                <header>
                                <h4>Στατιστικά</h4>
                                </header>
                                <div className="row">
                                    <div className="col-lg-6">
                                    <DropDown style={{width:"100%"}} name="month" label="Μήνας" data={months} textField="name"
                                        valueField="id" value={filter.month} onChange={this.onChange}/>
                                    </div>
                                    <div className="col-lg-6">
                                    <NumericTextBox style={{width:"100%"}} name="year" label="Έτος" 
                                        format='####' value={filter.year} onChange={this.onChange}/>
                                    </div>
                                </div>
                                <div className="row">
                                <Chart>
                                    <ChartCategoryAxis>
                                    <ChartCategoryAxisItem categories={
                                        ['Jan', 'Feb', 'Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                                        } />
                                    </ChartCategoryAxis>
                                    <ChartSeries>
                                    <ChartSeriesItem style='smooth' type="line" data={[1, 2, 3, 5]} />
                                    <ChartSeriesItem style='smooth' type="line" data={[12, 4, 1, 8]} />
                                    <ChartSeriesItem style='smooth' type="line" data={[1, 2, 3, 5]} />
                                    <ChartSeriesItem style='smooth' type="line" data={[12, 4, 1, 8]} />
                                    </ChartSeries>
                                </Chart>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Summary;