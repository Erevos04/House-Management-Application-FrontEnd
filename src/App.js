import React from "react";
import '@progress/kendo-theme-bootstrap/dist/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Common.css';
import Header from "./Components/Header.js";
import TabContainer from "./Components/TabContainer.js";

class App extends React.Component {

  render() {
    return (
      <div>
        <Header/>
        <TabContainer />
      </div>
    );
  }
}

export default App;
