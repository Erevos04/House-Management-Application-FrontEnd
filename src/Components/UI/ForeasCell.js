import React from 'react';

const cellWithForea = (props) => {
  switch(props.dataItem.foreas){
    case 1:{
      props.dataItem.foreas='ΔΕΗ'
      break;
    }
    case 2:{
      props.dataItem.foreas='ΟΤΕ'
      break;
    }
    case 3:{
      props.dataItem.foreas='OΤΕTV'
      break;
    }
    case 4:{
      props.dataItem.foreas='ΝΕΡΟ'
      break;
    }
    case 5:{
      props.dataItem.foreas='KINHTO'
      break;
    }
    case 6:{
      props.dataItem.foreas='ΕΥΔΑΠ'
      break;
    }
  }

  return (
    <td>
        {props.dataItem[props.field]}
    </td>
  );
}
export default cellWithForea;
