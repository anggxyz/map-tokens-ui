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


let confirmMapping ;

function downloadTokenDetails (dataString) {
  let win = window.open()
  win.document.write('<iframe src="' + dataString  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
  win.document.close()
}


async function executeTx (ethereum, p) {
  let tx = await txUtils.sendTx(ethereum, p)
  let element

  if (tx.error) {
    element = (
      <Alert variant='danger'>
          Error: {tx.error}
      </Alert>
    )
  } else {
    let downloadData = tx.downloadData
    let downloadDataHref = 'data: ' + 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(downloadData))
    element = (
      <Alert variant='success'>
          Transaction hash: <a href={tx.url + '/tx/' + tx.hash} target="_blank"> {tx.hash} </a>
          <br />
          Mapped Address on Matic (click to download data for reference):&nbsp;
          <code>
            <a href="#" onClick={ () => { return downloadTokenDetails(downloadDataHref) } } >
              `{tx.mappedAddress}`
            </a>
          </code>
      </Alert>
    )
    confirmMapping = tx.confirmMapping
  }
  ReactDOM.render(element, document.getElementById('alertArea'))

  if (tx.error) return false
  else return true
}

class TokenForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      displayConfirmMapping: false,
    }
  }
  async handleSubmit (event) {
    event.preventDefault();
    let success = await executeTx(this.props.provider, {
      owner: event.target[0].value,
      rootToken: event.target[1].value,
      name: event.target[2].value,
      symbol: event.target[3].value,
      decimals: event.target[4].value,
      isNFT: event.target[5].checked
    })
    if (success) {
      this.setState({
        displayConfirmMapping: true
      })
    }
  }

  async confirmMapping(event) {
  let element, tx

  if (this.props.provider.selectedAddress.toLowerCase() !== this.props.rootOwner.toLowerCase()) {
    console.info('selectedAddress', this.props.provider.selectedAddress, ' and root owner', this.props.rootOwner)
    element = (
      <Alert variant='danger'>
        Switch to Root Chain network on metamask, and Root Owner account. 
      </Alert>
    )
    ReactDOM.render(element, document.getElementById('alertArea2'))
    return;
  } 
  element = (
    <Alert variant='info'>
      Sending tx on root chain. Check console.
    </Alert>
  )
  ReactDOM.render(element, document.getElementById('alertArea2'))
  tx = await txUtils.mapOnRoot(confirmMapping.data, confirmMapping.contract, this.props.provider)

  if (tx.error) {
    element = (
      <Alert variant='danger'>
          Tx error. Check console.
      </Alert>
    )
  } else {
    element = (
      <Alert variant='success'>
        Confirmation Transaction Hash (on Root Chain): { tx }
      </Alert>
    )
  }

  ReactDOM.render(element, document.getElementById('alertArea2'))

  }

  render () {
    return (
      <Container>
        <Form 
          onSubmit = { this.handleSubmit.bind(this) }
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
            <Row>
              <Col sm={2}>
                <Button 
                  variant="primary" 
                  type="submit"
                  >
                  Map on Child 
                </Button>
              </Col>
              <Col>
                {
                  this.state.displayConfirmMapping ?
                  (
                    <Button 
                      variant="success"
                      onClick = { this.confirmMapping.bind(this) }
                    >
                      Confirm Mapping
                    </Button>
                  )
                  :
                  (
                    <p></p>
                  )
                  
                }
              </Col>
            </Row>
          </Form.Group>
        </Form>


        <div id="alertArea">
          
        </div>

        <div id="alertArea2">
          
        </div>

      </Container>
    );
  }
}

export default TokenForm;
