import React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import withValueField from './withValueField';

const DropDownListWithValueField = withValueField(DropDownList);

class DropDown extends React.Component{
  render(){
    return(
      <DropDownListWithValueField
        data={this.props.data}
        textField={this.props.textField}
        valueField={this.props.valueField}
        value={this.props.value}
        onChange={this.props.onChange}
        name={this.props.name}
        style={this.props.style}
        label={this.props.label}
      />
    )
  }
}
export default DropDown;
