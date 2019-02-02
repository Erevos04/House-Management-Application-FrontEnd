import React from 'react';
import axios from 'axios';
import { Grid, GridColumn as Column, GridDetailRow } from '@progress/kendo-react-grid';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import DropDown from './UI/DropDown';
import Loading from './UI/Loading.js';
import { cloneDeep, sumBy } from 'lodash';
import cellWithAmount from './UI/AmountCell';
import { format } from 'date-fns';
import { filterBy } from '@progress/kendo-data-query';
import cellWithDept from './UI/DeptCell.js';

let category = [{name:' ',id:0},{name:'ΦΡΕΣΚΑ',id:1},
              {name:'ΧΑΡΤΙΚΑ',id:2},{name:'ΚΑΘΑΡΙΣΤΙΚΑ',id:3},
              {name:'ΚΡΕΑΤΑ/ΨΑΡΙΑ',id:4},{name:'ΤΡΟΦΙΜΑ',id:5},{name:'ΛΟΙΠΑ',id:6}]

class DetailComponent extends GridDetailRow {
  render(){
    const data = this.props.dataItem.allDepts;
      return (
        <Grid
          data={data}
          >
          <Column title="Κατηγορία" field="category" cell={cellWithDept} />
          <Column title="Επιμέρους Ποσό" field="amount" cell={cellWithAmount}/>
        </Grid>
      );
  }
}

class Supermarket extends React.Component{
  state={
    supermarket:[],
    newDept:{
      category:0,
      amount:0
    },
    allDepts:[],
    insert: {
      id:0,
      date:null,
      amountTotal:0,
      allDepts:[],
      notes:''
    },
    loading: true,
    filter: undefined
  }

  componentDidMount(){
    this.getData();
  }

  getData = () =>{
    axios.get('api/getSupermarket').then(response=>{
      const supermarket= response.data.data.sort((a,b)=>(new Date(a.date) - new Date(b.date)))
        .map(entry=>( {...entry, ...{
          date: entry.date&&format(new Date(entry.date),"dd/MM/yyyy")
      }}));
      this.setState({
        supermarket:supermarket,
        loading:false
      });
    })
  }

  expandChange = (event) => {
    event.dataItem.expanded = !event.dataItem.expanded;
    this.forceUpdate();
  }

  onChange=(e)=>{
    let temp = cloneDeep(this.state.insert);
    temp[e.target.props.name]=e.target.value;
    this.setState({
      insert:{...temp}
    });
  }

  onDeptChange=(e)=>{
    let temp = cloneDeep(this.state.newDept);
    temp[e.target.props.name]=e.target.value;
    this.setState({
      newDept: {...temp}
    });
  }

  insert=()=>{
    const oldAllDepts = cloneDeep(this.state.allDepts);
    const newDept = cloneDeep(this.state.newDept);
    const allDepts = [...oldAllDepts, newDept];
    this.setState({
      allDepts: allDepts,
      newDept:{
        category:0,
        amount:0
      }
    });
  }

  insertAll = () =>{
    const insert = cloneDeep(this.state.insert);
    const depts = cloneDeep(this.state.allDepts);
    const total = sumBy(depts,'amount');
    const toSubmit = {...insert,...{allDepts:depts, amountTotal:total,id:this.state.supermarket.length+1}}
    axios.post('api/newSupermarket',toSubmit).then(response=>{
      if(response.data.success===true){
        this.setState({
          loading:true,
          insert:{
            id:0,
            date:null,
            amountTotal:0,
            allDepts:[],
            notes:''
          },
          allDepts:[]
        });
        this.getData();
      }
      else {
        console.log("Error");
      }
    })
  }

  render(){
    const {loading, supermarket, insert, filter, newDept, allDepts} = this.state;
    return(
      <div className="row">
        <div className="col-md-4">
          <div className="form-horizontal">
            <article>
              <header>
                <h4>Προσθήκη Νέου Supermarket</h4>
              </header>

            <div className="row">
              <div className="col-lg-6">
              <label className='label'>Κατηγορία</label>
                <DropDown style={{width:"100%"}} name="category" data={category} textField="name"
                          valueField="id" value={newDept.category} onChange={this.onDeptChange}/>
              </div>
              <div className="col-lg-6">
              <label className='label'>Ποσό</label>
                <NumericTextBox style={{width:"100%"}} name="amount" min={0} value={newDept.amount} onChange={this.onDeptChange}/>
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
              <div className="col-lg-6">
                <button onClick={this.insert} disabled={newDept.category===0 || newDept.amount===0}
                  className="k-button k-primary"> Add </button>
              </div>
              <div className="col-lg-6">
                <button style={{float:'right'}} onClick={this.insertAll} disabled={allDepts.length===0 || insert.date===null}
                  className="k-button k-primary"> Submit </button>
              </div>
            </div>
            &nbsp;
            <header>
              <h4>Παρούσα Καταχώρηση</h4>
            </header>
            <div className='row'>
              <div className='col-md-12'>
                <Grid 
                  data={allDepts}
                >
                <Column title="Κατηγορία" field="category" cell={cellWithDept} width='250px' />
                <Column title="Επιμέρους Ποσό" field="amount" cell={cellWithAmount} width='100px'/>
                </Grid>
              </div>
            </div>  
          </article>
        </div>
        


        </div>

        <div className="col-md-8">
          <article>
            <header>
              <h4>Αρχείο Supermarket</h4>
            </header>
          <div className="form-horizontal">
            {!loading ?
            <Grid
              detail={DetailComponent}
              style={{ height: '420px' }}
              data={filterBy(supermarket, filter)}
              filterable
              filter={filter}
              onFilterChange={(e) => {
                  this.setState({
                      filter: e.filter
                  })}}
              expandField="expanded"
              onExpandChange={this.expandChange}
              >
              <Column title="ID" field="id" filterable={false} width="50px"/>
              <Column title="Date" field="date" filter="date" format="{0:d}" width="180px"/>
              <Column title="Ποσό" field="amountTotal" filterable={false} cell={cellWithAmount} width="80px"/>
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

export default Supermarket;
