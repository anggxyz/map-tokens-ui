import Network from '@maticnetwork/meta/network';
import Web3 from 'web3';

async function generateTxParams (ethereum, obj) {
  let web3 = new Web3(ethereum)
  let chainId = ethereum.networkVersion
  let network
  
  switch(chainId) {
    case '16110': 
      network = new Network('beta', 'v2')
      break;
    case '15001': 
      network = new Network('testnet', 'v3')
      break;
    default:
      return({
        error: 'Unsupported network. (Tesnetv3/ betav2 are supported)'
      })
  }

  let ChildChainAbi = network.abi('ChildChain')
  let ChildChainAddress = network.Matic.Contracts.ChildChain

  let ChildChainContract = new web3.eth.Contract(
      ChildChainAbi,
      ChildChainAddress
    )
  
  if (!web3.utils.isAddress(obj.owner) 
        || !web3.utils.isAddress(obj.rootToken)
        || obj.owner === '0x0000000000000000000000000000000000000000'
        || obj.rootToken === '0x0000000000000000000000000000000000000000') {
    return ({
      error: 'Owner/ Token address invalid'
    })
  }

  if (obj.owner === obj.rootToken) {
    return ({
      error: 'Root token addr and Owner addr cannot be same.'
    })
  }

  if (isNaN(obj.decimals)) {
    return ({
      error: 'Only numbers valid for decimals'
    })
  }


  let _from = ethereum.selectedAddress
  let _gas = 5000000
  let tx, _mappedAddress

  await ChildChainContract.methods.addToken(
    obj.owner, 
    obj.rootToken, 
    obj.name, 
    obj.symbol, 
    obj.decimals, 
    obj.isNft
  )
  .send({
    from: _from,
    gas: _gas
  })
  .on('receipt', (r) => {
    tx = r.transactionHash
    _mappedAddress = r.events.NewToken.returnValues.token;
  })
  .on('error', (err) => {
    console.error(err)
    return({
      error: 'Failed tx. Check console for error.'
    })
  })

  return ({
    hash: tx,
    url: network.Matic.Explorer,
    mappedAddress: _mappedAddress
  })
}

export default {
  generateTxParams: generateTxParams
}
