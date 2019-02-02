import React from 'react';
import axios from 'axios';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import DropDown from './UI/DropDown';
import Loading from './UI/Loading.js';
import { cloneDeep } from 'lodash';
import AutoCell from './UI/AutoCell';
import cellWithAmount from './UI/AmountCell';
import { format } from 'date-fns';
import { filterBy } from '@progress/kendo-data-query';

let category = [{name:' ',id:0},{name:'ΒΕΝΖΙΝΗ',id:1},
              {name:'ΔΙΟΔΙΑ',id:2},{name:'ΛΟΙΠΑ',id:3}]

class Autokinito extends React.Component{
  state={
    autoExpenses:[],
    insert:{
      id:0,
      category:0,
      date:null,
      amount:0,
      notes:''
    },
    loading:true,
    filter: undefined
  }

  componentDidMount(){
    this.getData();
  }

  getData = () =>{
    axios.get('api/getAutokinito').then(response=>{
      const autokinito= response.data.data.sort((a,b)=>(new Date(a.date) - new Date(b.date)))
        .map(entry=>( {...entry, ...{
        date: entry.date&&format(new Date(entry.date),"dd/MM/yyyy")
      }}));
      this.setState({
        autoExpenses:autokinito,
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
    newInsert.id=this.state.autoExpenses.length+1
    axios.post('api/newAutokinito',newInsert).then(response=>{
      if(response.data.success===true){
        this.setState({
          loading:true,
          insert:{
            id:0,
            category:0,
            date:null,
            amount:0,
            notes:''
          }

        });
        this.getData();
      }
      else {
        console.log("Error");
      }
    })
  }

  render(){
    const {loading, autoExpenses, insert, filter} = this.state;
      return(
        <div className="row">
          <div className="col-md-4">
            <div className="form-horizontal">
              <article>
                <header>
                  <h4>Προσθήκη Νέου Εξόδου</h4>
                </header>
              <div className="row">
                <div className="col-lg-6">
                <label className='label'>Kατηγορία</label>
                  <DropDown style={{width:"100%"}} name="category" data={category} textField="name"
                            valueField="id" value={insert.category} onChange={this.onChange}/>
                </div>
                <div className="col-lg-6">
                <label className='label'>Ποσό</label>
                  <NumericTextBox style={{width:"100%"}} name="amount" min={0} value={insert.amount} onChange={this.onChange}/>
                </div>

              </div>

              <div className="row">
                <div className="col-lg-6">
                <label className='label'>Ημερομηνία</label>
                  <DatePicker name='date' format='dd/MM/yyyy' style={{width:"100%"}} value={insert.date} onChange={this.onChange}/>

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
                <h4>Αρχείο Αυτοκινήτου</h4>
              </header>
            <div className="form-horizontal">
              {!loading ?
              <Grid
                style={{ height: '420px' }}
                data={filterBy(autoExpenses, this.state.filter)}
                filterable
                filter={this.state.filter}
                onFilterChange={(e) => {
                    this.setState({
                        filter: e.filter
                    })}}
                >
                <Column title="ID" field="id" filterable={false} width="50px"/>
                <Column title="Κατηγορία" field="category" filterable={false} cell={AutoCell} width="100px"/>
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
export default Autokinito;
