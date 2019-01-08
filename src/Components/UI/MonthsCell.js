import React from 'react';

const MonthsCell = (props) => {
  switch(props.dataItem.months){
    case 1:{
        props.dataItem.months='ΙΑΝΟΥΑΡΙΟΣ'
        break;
    }
    case 2:{
        props.dataItem.months='ΦΕΒΡΟΥΑΡΙΟΣ'
        break;
    }
    case 3:{
        props.dataItem.months='ΜΑΡΤΙΟΣ'
        break;
    }
    case 4:{
        props.dataItem.months='ΑΠΡΙΛΙΟΣ'
        break;
    }
    case 5:{
        props.dataItem.months='ΜΑΙΟΣ'
        break;
    }
    case 6:{
        props.dataItem.months='ΙΟΥΝΙΟΣ'
        break;
    }
    case 7:{
        props.dataItem.months='ΙΟΥΛΙΟΣ'
        break;
    }
    case 8:{
        props.dataItem.months='ΑΥΓΟΥΣΤΟΣ'
        break;
    }
    case 9:{
        props.dataItem.months='ΣΕΠΤΕΜΒΡΙΟΣ'
        break;
    }
    case 10:{
        props.dataItem.months='ΟΚΤΩΒΡΙΟΣ'
        break;
    }
    case 11:{
        props.dataItem.months='ΝΟΕΜΒΡΙΟΣ'
        break;
    }
    case 12:{
        props.dataItem.months='ΔΕΚΕΜΒΡΙΟΣ'
        break;
    }
  }

  return (
    <td>
        {props.dataItem[props.field]}
    </td>
   );
}
export default MonthsCell;
