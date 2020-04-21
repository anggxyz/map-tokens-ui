import React, { Component } from 'react';
import Network from '@maticnetwork/meta/network';
import Web3 from 'web3';
import TokenForm from './components/TokenForm';
import Header from './components/Header';
import {
  Container
} from 'react-bootstrap';
let eth, network
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentNetwork: null,
      ChildOwnerAccount: null,
      RootOwnerAccount: null,
      message: '',
      messageVariant: ''
    }
  } 

  async componentDidMount() {
    // init contracts (registry and childchain)
    if (typeof window.ethereum !== 'undefined') {
      eth = window['ethereum']
    } else {
      await window.ethereum.enable()
    }

    if (eth.networkVersion === '16110') {
      network = new Network('beta', 'v2')
    }
    else if (eth.networkVersion === '15001') {
      network = new Network('testnet', 'v3')
    } 
    else {
      this.setState({
        message: 'Switch Metamask to one of the supported networks (testnetv3/ betav2). Please clear cache if the network isnt detectable',
        messageVariant: 'danger'
      })
    }
    if(typeof network !== 'undefined') {
      let childWeb3 = new Web3(network.Matic.RPC)
      let rootWeb3 = new Web3(network.Main.RPC)

      let Registry = new rootWeb3.eth.Contract(
          network.abi('Registry'), 
          network.Main.Contracts.Registry
      )

      let ChildChain = new childWeb3.eth.Contract(
          network.abi('ChildChain'),
          network.Matic.Contracts.ChildChain
      )

      let _childChainOwner = await ChildChain.methods
        .owner()
        .call()

      let _rootChainOwner = await Registry.methods
        .owner()
        .call()
      
      this.setState({
        ChildOwnerAccount: _childChainOwner,
        RootOwnerAccount: _rootChainOwner,
        currentNetwork: eth.networkVersion
      })

      eth.autoRefreshOnNetworkChange = false;

    }
    
  }

  render() {
    return (
      <Container>
        <Header
          currentNetwork = {this.state.currentNetwork}
          ChildOwnerAccount = {this.state.ChildOwnerAccount}
          RootOwnerAccount = {this.state.RootOwnerAccount}
          message = {this.state.message}
          messageVariant = {this.state.messageVariant}
        />
        <br />
        <TokenForm
          provider = {eth}  
          rootOwner = {this.state.RootOwnerAccount}      
        />
      </Container>
    )
  }
}

export default App;
