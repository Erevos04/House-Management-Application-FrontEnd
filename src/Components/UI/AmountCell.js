import React from 'react';

const cellWithAmount = (props) => {
  return (
    <td>
        {`${props.dataItem[props.field]}\u20AC`}
    </td>
  );
}
export default cellWithAmount;
