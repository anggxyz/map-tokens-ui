import React, { Component } from 'react';
import TokenForm from './components/TokenForm';
import Header from './components/Header';
import {
  Container
} from 'react-bootstrap';

class App extends Component {

  componentWillMount() {
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
    }
  } 

  render() {
    return (
      <Container>
        <Header />
        <br />
        <TokenForm />
      </Container>
    )
  }
}

export default App;
