import React from 'react';

const cellWithDept = (props) => {
  switch(props.dataItem.category){
    case 1:{
      props.dataItem.category='ΦΡΕΣΚΑ'
      break;
    }
    case 2:{
      props.dataItem.category='ΧΑΡΤΙΚΑ'
      break;
    }
    case 3:{
      props.dataItem.category='ΚΑΘΑΡΙΣΤΙΚΑ'
      break;
    }
    case 4:{
      props.dataItem.category='ΚΡΕΑΤΑ/ΨΑΡΙΑ'
      break;
    }
    case 5:{
      props.dataItem.category='ΤΡΟΦΙΜΑ'
      break;
    }
    case 6:{
      props.dataItem.category='ΛΟΙΠΑ'
      break;
    }
  }

  return (
    <td>
        {props.dataItem[props.field]}
    </td>
  );
}
export default cellWithDept;
