import React from 'react';
import axios from 'axios';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import DropDown from './UI/DropDown';
import '@progress/kendo-theme-bootstrap/dist/all.css';
import Loading from './UI/Loading.js';
import { cloneDeep } from 'lodash';
import cellWithAmount from './UI/AmountCell';
import { format, getMonth } from 'date-fns';
import { filterBy } from '@progress/kendo-data-query';
import AtomoCell from './UI/AtomoCell';
import MonthsCell from './UI/MonthsCell';

let persons = [{name:'ΛΥΔΙΑ',id:1},
              {name:'ΟΡΕΣΤΗΣ',id:2}];

let months = [{name:'ΙΑΝΟΥΑΡΙΟΣ',id:1},{name:'ΦΕΒΡΟΥΑΡΙΟΣ',id:2},{name:'ΜΑΡΤΙΟΣ',id:3},
            {name:'ΑΠΡΙΛΙΟΣ',id:4},{name:'ΜΑΙΟΣ',id:5},{name:'ΙΟΥΝΙΟΣ',id:6},
            {name:'ΙΟΥΛΙΟΣ',id:7},{name:'ΑΥΓΟΥΣΤΟΣ',id:8},{name:'ΣΕΠΤΕΜΒΡΙΟΣ',id:9},
            {name:'ΟΚΤΩΒΡΙΟΣ',id:10},{name:'ΝΟΕΜΒΡΙΟΣ',id:11},{name:'ΔΕΚΕΜΒΡΙΟΣ',id:12}];

class Misthoi extends React.Component{
  state={
    misthoi:[],
    insert:{
      id:0,
      person:0,
      date:null,
      amount:0,
      notes:'',
      month:getMonth(new Date())
    },
    loading:true,
    filter: undefined
  }

  componentDidMount(){
    this.getData();
  }

  getData = () =>{
    axios.get('api/getMisthoi').then(response=>{
      const misthoi= response.data.data.sort((a,b)=>(new Date(a.date) - new Date(b.date)))
        .map(entry=>( {...entry, ...{
        date: entry.date&&format(new Date(entry.date),"dd/MM/yyyy")
      }})); 
      this.setState({
        misthoi:misthoi,
        loading:false
      });
    })
  }

  onChange=(e)=>{
    let temp = cloneDeep(this.state.insert);
    temp[e.target.props.name]=e.target.value;
    this.setState({
      insert:{...temp}
    });
  }

  insert=()=>{
    const newInsert = cloneDeep(this.state.insert);
    newInsert.id=this.state.misthoi.length+1
    axios.post('api/newMisthos',newInsert).then(response=>{
      if(response.data.success===true){
        this.setState({
          loading:true
        });
        this.getData();
      }
      else {
        console.log("Error");
      }
    })
  }

  render(){
    const {loading, misthoi, insert } = this.state;
      return(
        <div className="row">
          <div className="col-md-4">
            <div className="form-horizontal">
              <article>
                <header>
                  <h4>Προσθήκη Νέου Εσόδου</h4>
                </header>
              <div className="row">
                <div className="col-lg-6">
                <label className='label'>Άτομο</label>
                  <DropDown style={{width:"100%"}} name="person" data={persons} textField="name"
                            valueField="id" value={insert.person} onChange={this.onChange}/>
                </div>
                <div className="col-lg-6">
                <label className='label'>Έσοδο</label>
                  <NumericTextBox format='n0' style={{width:"100%"}} name="amount" min={0} value={insert.amount} onChange={this.onChange}/>
                </div>

              </div>

              <div className="row">
                <div className="col-lg-6">
                <label className='label'>Για τον μήνα</label>
                  <DropDown style={{width:"100%"}} name="month" data={months} textField="name"
                            valueField="id" value={insert.month} onChange={this.onChange}/>
                </div>
                <div className="col-lg-6">
                <label className='label'>Ημερομηνία</label>
                  <DatePicker format='dd/MM/yyyy' style={{width:"100%"}} name="date" value={insert.date} onChange={this.onChange}/>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                <label className='label'>Notes</label>
                  <Input style={{width:"100%"}} name="notes" value={insert.notes} onChange={this.onChange}/>
                </div>
              </div>
              &nbsp;
              <div className="row">
                <div className="col-lg-12">
                  <button onClick={this.insert} disabled={insert.category===0||insert.amount===0||insert.date===null}
                    className="k-button k-primary"> Insert </button>
                </div>
              </div>
            </article>
          </div>
          </div>

          <div className="col-md-8">
            <article>
              <header>
                <h4>Αρχείο Εσόδων</h4>
              </header>
            <div className="form-horizontal">
              {!loading ?
              <Grid
                style={{ height: '420px' }}
                data={filterBy(misthoi, this.state.filter)}
                filterable
                filter={this.state.filter}
                onFilterChange={(e) => {
                    this.setState({
                        filter: e.filter
                    })}}
                >
                <Column title="ID" field="id" filterable={false} width="50px"/>
                <Column title="Άτομο" field="person" filterable={false} cell={AtomoCell} width="100px"/>
                <Column title="Μήνας" field="month" filterable={false} cell={MonthsCell} width="100px"/>
                <Column title="Ημερομηνία" field="date" filter="date" format="{0:d}" width="180px"/>
                <Column title="Ποσό" field="amount" filterable={false} cell={cellWithAmount} width="80px"/>
                <Column title="Notes" field="notes" filterable={false} width="250px"/>
              </Grid>
              : <Loading/>}
            </div>
            </article>
          </div>
        </div>
    )
  }
}
export default Misthoi;
