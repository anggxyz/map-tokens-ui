import React, { 
  Component
} from 'react';
import ReactDOM from 'react-dom'
import {
  Container,
  Form, 
  Button,
  Alert,
  Row, Col,
} from 'react-bootstrap';

import txUtils from '../utils/txUtils';
let ethereum;


async function executeTx (p) {
  let tx = await txUtils.generateTxParams(ethereum, p)
  let element
  if (tx.error) {
    element = (
      <Alert variant='danger'>
          Error: {tx.error}
      </Alert>
    )
    ReactDOM.render(element, document.getElementById('alertArea'))  
  }

  element = (
    <Alert variant='success'>
        Transaction hash: <a href={tx.url + '/tx/' + tx.hash} target="_blank"> {tx.hash} </a>
        <br />
        Mapped Address on Matic: `{tx.mappedAddress}`
    </Alert>
  )
  ReactDOM.render(element, document.getElementById('alertArea'))  

  console.log(tx)
}

class TokenForm extends Component {

  async componentWillMount() {
    if (typeof window.ethereum !== 'undefined') {
      ethereum = window['ethereum']
    } else {
      await window.ethereum.enable()
    }
  }

  async handleSubmit (event) {
    event.preventDefault();

    await executeTx({
      owner: event.target[0].value,
      rootToken: event.target[1].value,
      name: event.target[2].value,
      symbol: event.target[3].value,
      decimals: event.target[4].value,
      isNFT: event.target[5].checked
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      accounts: null
    }
  } 

  render () {
    return (
      <Container>
        <Form 
          onSubmit = {this.handleSubmit}
        >
          <Form.Group>
            <Row>
              <Col sm={2}>
                <Form.Label 
                >
                  Owner
                </Form.Label>
              </Col>
              <Col>
                <Form.Control 
                  type="text" 
                  placeholder="Address of owner on root/owner contract on sidechain" 
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col sm={2}>
                <Form.Label 
                >
                  Root Token
                </Form.Label>
              </Col>
              <Col>
                <Form.Control 
                  type="text" 
                  placeholder="Address of token on root chain" 
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group>
            <Row>
              <Col sm={2}>
                <Form.Label 
                >
                  Name
                </Form.Label>
              </Col>
              <Col>
                <Form.Control 
                  type="text" 
                  placeholder="Name of token" 
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group>
            <Row>
              <Col sm={2}>
                <Form.Label 
                >
                  Symbol
                </Form.Label>
              </Col>
              <Col>
                <Form.Control 
                  type="text" 
                  placeholder="Symbol of the token" 
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group>
            <Row>
              <Col sm={2}>
                <Form.Label 
                >
                  Decimals
                </Form.Label>
              </Col>
              <Col>
                <Form.Control 
                  type="text" 
                  placeholder="Decimals (for ERC20), leave empty for ERC721" 
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group>
            <Form.Check 
              type="switch" 
              label="Is NFT?" 
              id="isNFT"
            />
          </Form.Group>

          <Form.Group>
            <Button 
              variant="primary" 
              type="submit"
              >
              Map on Child Chain
            </Button>
          </Form.Group>

        </Form>

        <div id="alertArea">
          
        </div>


      </Container>
    );
  }
}

export default TokenForm;
