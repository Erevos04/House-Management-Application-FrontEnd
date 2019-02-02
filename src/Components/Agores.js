import React from 'react';
import axios from 'axios';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import DropDown from './UI/DropDown';
import Loading from './UI/Loading.js';
import { cloneDeep } from 'lodash';
import AgoresCell from './UI/AgoresCell';
import cellWithAmount from './UI/AmountCell';
import { format } from 'date-fns';
import { filterBy } from '@progress/kendo-data-query';

let category = [{name:' ',id:0},{name:'ΡΟΥΧΑ',id:1},
              {name:'ΣΠΙΤΙ',id:2},{name:'ΚΑΛΛΥΝΤΙΚΑ',id:3},
              {name:'ΣΥΣΚΕΥΕΣ',id:4}]

class Agores extends React.Component{
  state={
    agores:[],
    insert:{
      id:0,
      category:0,
      date:null,
      amount:0,
      description:'',
      notes:''
    },
    loading:true,
    filter: undefined
  }

  componentDidMount(){
    this.getData();
  }

  getData = () =>{
    axios.get('api/getAgores').then(response=>{
      const agores= response.data.data.sort((a,b)=>(new Date(a.date) - new Date(b.date)))
        .map(entry=>({...entry, ...{
        date: entry.date&&format(new Date(entry.date),"dd/MM/yyyy")
      }}));
      this.setState({
        agores:agores,
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
    newInsert.id=this.state.agores.length+1
    axios.post('api/newAgora',newInsert).then(response=>{
      if(response.data.success===true){
        this.setState({
          loading:true,
          insert:{
            id:0,
            category:0,
            date:null,
            amount:0,
            description:'',
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
    const {loading, agores, insert, filter} = this.state;
    return(
      <div className="row">
        <div className="col-md-4">
          <div className="form-horizontal">
            <article>
              <header>
                <h4>Προσθήκη Νέας Αγοράς</h4>
              </header>
            <div className="row">
              <div className="col-lg-6">
              <label className='label'>Kατηγορία</label>
                <DropDown style={{width:"100%"}} name="category" data={category} textField="name"
                          valueField="id" value={insert.category} onChange={this.onChange}/>
              </div>
              <div className="col-lg-6">
              <label className='label'>Περιγραφή</label>
                <Input style={{width:"100%"}} name="description" value={insert.description} onChange={this.onChange}/>
              </div>
              <div className="col-lg-6">
              <label className='label'>Ποσό</label>
                <NumericTextBox style={{width:"100%"}} name="amount" min={0} value={insert.amount} onChange={this.onChange}/>
              </div>

            </div>

            <div className="row">
              <div className="col-lg-6">
              <label className='label'>Ημερομηνία</label>
                <DatePicker format='dd/MM/yyyy' style={{width:"100%"}} name="date" label="Date" value={insert.date} onChange={this.onChange}/>

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
              <h4>Αρχείο Αγορών</h4>
            </header>
          <div className="form-horizontal">
            {!loading ?
            <Grid
              style={{ height: '420px' }}
              data={filterBy(agores, this.state.filter)}
              filterable
              filter={this.state.filter}
              onFilterChange={(e) => {
                  this.setState({
                      filter: e.filter
                  })}}
              >
              <Column title="ID" field="id" filterable={false} width="50px"/>
              <Column title="Κατηγορία" field="category" filterable={false} cell={AgoresCell} width="140px"/>
              <Column title="Περιγραφή" field="description" filterable={false} width="150px"/>
              <Column title="Ημερομηνία" field="date" filter="date" format="{0:d}" width="150px"/>
              <Column title="Ποσό" field="amount" filterable={false} cell={cellWithAmount} width="80px"/>
              <Column title="Notes" field="notes" filterable={false} width="300px"/>
            </Grid>
            : <Loading/>}
          </div>
          </article>
        </div>
      </div>
    )
  }
}

export default Agores;
