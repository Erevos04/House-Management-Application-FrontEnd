import React from 'react';

const AutoCell = (props) => {
  switch(props.dataItem.category){
      case 1:{
        props.dataItem.category='ΒΕΝΖΙΝΗ'
        break;
      }
      case 2:{
        props.dataItem.category='ΔΙΟΔΙΑ'
        break;
      }
      case 3:{
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
