import React from 'react';

const AtomoCell = (props) => {
  switch(props.dataItem.person){
      case 1:{
        props.dataItem.person='ΛΥΔΙΑ'
        break;
      }
      case 2:{
        props.dataItem.person='ΟΡΕΣΤΗΣ'
        break;
      }
    }

    return (
      <td>
          {props.dataItem[props.field]}
      </td>
    );
}
export default AtomoCell;
