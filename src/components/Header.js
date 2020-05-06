import React, { Component } from 'react';
import {
  Navbar,
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
      // <Jumbotron>
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>
            Map Tokens on Matic Chain
          </Navbar.Brand>
        </Navbar>
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
            (
              <Alert variant='info'>
                1. Make sure you're connected to Owner Account (ref above)
                <br></br>
                2. Check console for errors/debugging
                <br></br>
                3. Do NOT reload once Mapping process has started
                <br></br>
                4. Switch to Owner Account on Ropsten (for testnetv3) and Mainnet (for betav2) to confirm mapping (after successful mapping on child chain) - force reload has been kept off. Please do not reload.
              </Alert>
            )
        }
        </div>
      // </Jumbotron>
    )
  }
}

export default Header;
