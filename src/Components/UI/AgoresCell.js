import React from 'react';

const AutoCell = (props) => {
  switch(props.dataItem.category){
      case 1:{
        props.dataItem.category='ΡΟΥΧΑ'
        break;
      }
      case 2:{
        props.dataItem.category='ΣΠΙΤΙ'
        break;
      }
      case 3:{
        props.dataItem.category='ΚΑΛΥΝΤΙΚΑ'
        break;
      }
      case 4:{
        props.dataItem.category='ΣΥΣΚΕΥΕΣ'
        break;
      }
      case 5:{
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
export default AutoCell;
