import React, { Component } from 'react';

import './App.css';
import Root from "./containers/root";

class App extends Component {
  render() {
    return (

            <Root program_id={this.props.program_id}/>


    );
  }
}

export default App;
