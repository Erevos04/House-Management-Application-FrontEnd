import React from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import Logariasmoi from "./Logariasmoi.js";
import Supermarket from "./Supermarket.js";
import Autokinito from "./Autokinito.js";
import Agores from "./Agores.js";
import Misthoi from './Misthoi.js';
import Summary from './Summary.js';

class TabContainer extends React.Component {
state = {
          selected: 0
        }

  handleSelect = (e) => {
      this.setState({selected: e.selected});
  }
  
  render(){
      return (
        <TabStrip selected={this.state.selected} onSelect={this.handleSelect}>
        {/* <TabStripTab title="Summary">
            <Summary />
          </TabStripTab> */}
        <TabStripTab title="Μισθοί">
            <Misthoi />
          </TabStripTab>
          <TabStripTab title="Λογαριασμοί">
            <Logariasmoi />
          </TabStripTab>
          <TabStripTab title="Supermarket">
            <Supermarket/>
          </TabStripTab>
          <TabStripTab title="Αυτοκίνητο">
            <Autokinito/>
          </TabStripTab>
          <TabStripTab title="Αγορές">
            <Agores/>
          </TabStripTab>
        </TabStrip>
    )
  }
}
export default TabContainer;
