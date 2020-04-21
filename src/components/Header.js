import React, { Component } from 'react';
import {
  Jumbotron,
  Alert,
  ListGroup
} from 'react-bootstrap';

class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentNetwork: '',
      ChildOwnerAccount: '',
      RootOwnerAccount: '',
      message: '',
      messageVariant: ''
    }
  }

  render() {
    return (
      <Jumbotron>
        <h1> Map Tokens on Matic Chain </h1>
        <hr></hr>
        <ListGroup>
          <ListGroup.Item>
            Connected to Chain: <code> {this.props.currentNetwork} </code>
          </ListGroup.Item>

          <ListGroup.Item>
            Owner account on Root Chain: <code> {this.props.RootOwnerAccount} </code>
          </ListGroup.Item>

          <ListGroup.Item>
            Owner account on Child Chain: <code> {this.props.ChildOwnerAccount} </code>
          </ListGroup.Item>
          
        </ListGroup>
        <hr></hr>
        { this.props.message?
          (
            <Alert variant={this.props.messageVariant}>
              {this.props.message}
            </Alert>
          )
          :
          <span />
        }
      </Jumbotron>
    )
  }
}

export default Header;
