import React from 'react';
import axios from 'axios';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import DropDown from './UI/DropDown';
import '@progress/kendo-theme-bootstrap/dist/all.css';
import Loading from './UI/Loading.js';
import { cloneDeep } from 'lodash';
import cellWithForea from './UI/ForeasCell';
import cellWithAmount from './UI/AmountCell';
import { format } from 'date-fns';
import { filterBy } from '@progress/kendo-data-query';

let foreis = [{name:' ',id:0},{name:'ΔΕΗ',id:1},
              {name:'ΟΤΕ',id:2},{name:'OΤΕTV',id:3},
              {name:'ΝΕΡΟ',id:4},{name:'KINHTO',id:5},
              {name:'ΕΥΔΑΠ',id:6}]

class Logariasmoi extends React.Component{
  state={
    logariasmoi:[],
    insert: {
      id:0,
      foreas:0,
      datePrinted:null,
      datePayed:null,
      amount:0,
      notes:''
    },
    loading: true,
    filter: undefined
  }

  componentDidMount(){
    this.getData();
  }

  getData = () =>{
    axios.get('api/getLogariasmoi').then(response=>{
      const logariasmoi= response.data.data.sort((a,b)=>(new Date(a.datePayed) - new Date(b.datePayed)))
        .map(entry=>( {...entry, ...{
        datePrinted: format(new Date(entry.datePrinted),"dd/MM/yyyy"),
        datePayed: format(new Date(entry.datePayed),"dd/MM/yyyy")
      }}));
      this.setState({
        logariasmoi:logariasmoi,
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
    newInsert.id=this.state.logariasmoi.length+1
    axios.post('api/newLogariasmos',newInsert).then(response=>{
      if(response.data.success===true){
        this.setState({
          loading:true,
          insert:{}
        });
        this.getData();
      }
      else {
        console.log("Error");
      }
    })
  }

  render(){
    const {loading, logariasmoi, insert, filter} = this.state;
    return(
      <div className="row">
        <div className="col-md-4">
          <div className="form-horizontal">
            <article>
              <header>
                <h4>Προσθήκη Νέου Λογαριασμού</h4>
              </header>
            <div className="row">
              <div className="col-lg-6">
              <label className='label'>Φορέας</label>
                <DropDown style={{width:"100%"}} name="foreas" data={foreis} textField="name"
                          valueField="id" value={insert.foreas} onChange={this.onChange}/>
              </div>
              <div className="col-lg-6">
              <label className='label'>Ποσό</label>
                <NumericTextBox style={{width:"100%"}} name="amount" min={0} value={insert.amount} onChange={this.onChange}/>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6">
              <label className='label'>Έκδοση</label>
                <DatePicker format='dd/MM/yyyy' style={{width:"100%"}} name="datePrinted" label="DatePrinted" value={insert.datePrinted} onChange={this.onChange}/>

              </div>
              <div className="col-lg-6">
              <label className='label'>Πληρωμή</label>
                <DatePicker format='dd/MM/yyyy' style={{width:"100%"}} name="datePayed" label="DatePayed" value={insert.datePayed} onChange={this.onChange}/>
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
                <button onClick={this.insert} disabled={insert.foreas===0||insert.amount===0||insert.datePrinted===null
                  ||insert.datePayed===null} className="k-button k-primary"> Insert </button>
              </div>
            </div>
          </article>
        </div>
        </div>

        <div className="col-md-8">
          <article>
            <header>
              <h4>Αρχείο Λογαριασμών</h4>
            </header>
          <div className="form-horizontal">
            {!loading ?
            <Grid
              style={{ height: '420px' }}
              data={filterBy(logariasmoi, this.state.filter)}
              filterable
              filter={this.state.filter}
              onFilterChange={(e) => {
                  this.setState({
                      filter: e.filter
                  })}}
              >
              <Column title="ID" field="id" filterable={false} width="50px"/>
              <Column title="Φορέας" field="foreas" filterable={false} cell={cellWithForea} width="100px"/>
              <Column title="Έκδοση" field="datePrinted" filter="date" format="{0:d}" width="180px"/>
              <Column title="Πληρωμή" field="datePayed" filter="date" format="{0:d}" width="180px"/>
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

export default Logariasmoi;
