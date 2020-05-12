import Network from '@maticnetwork/meta/network';
import Web3 from 'web3';

async function sendTx (ethereum, obj) {
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
  let RegistryAbi = network.abi('Registry')
  let RegistryAddress = network.Main.Contracts.Registry

  let ChildChainContract = new web3.eth.Contract(
      ChildChainAbi,
      ChildChainAddress
    )

  // @todo probably dont need this if only encoding abi?
  let rootWeb3 = new Web3(network.Main.RPC)
  let RegistryContract = new rootWeb3.eth.Contract(
      RegistryAbi,
      RegistryAddress
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
  let tx, _mappedAddress, _mappedRoot

  await ChildChainContract.methods.addToken(
    obj.owner, 
    obj.rootToken, 
    obj.name, 
    obj.symbol, 
    obj.decimals, 
    obj.isNFT
  )
  .send({
    from: _from,
    gas: _gas
  })
  .on('receipt', (r) => {
    tx = r.transactionHash
    _mappedAddress = r.events.NewToken.returnValues.token;
    _mappedRoot = r.events.NewToken.returnValues.rootToken;
  })
  .on('error', (err) => {
    console.error(err)
    return({
      error: 'Failed tx. Check console for error.'
    })
  })

  // for debugging
  let _mappedType = await ChildChainContract.methods.isERC721(obj.rootToken).call()

  

  let _confirmMappingData = await RegistryContract.methods.mapToken(
    obj.rootToken,
    _mappedAddress,
    obj.isNft
  ).encodeABI()

  let _confirmMapping = {
    data: _confirmMappingData,
    contract: RegistryAddress
  }

  let _downloadData = {
    root: {
      rpc: network.Main.RPC,
      token: _mappedRoot,
      isERC721: obj.isNFT
    },
    child: {
      rpc: network.Matic.RPC,
      token: _mappedAddress,
      isERC721: _mappedType
    },
    mappingData: _confirmMappingData
  }

  return ({
    hash: tx,
    url: network.Matic.Explorer,
    mappedAddress: _mappedAddress,
    downloadData: _downloadData,
    confirmMapping: _confirmMapping
  })
}

async function mapOnRoot(txdata, addr, provider) {
  let web3 = new Web3(provider)
  let tx
  try {
    await web3.eth.sendTransaction({
      from: provider.selectedAddress,
      data: txdata,
      to: addr,
      gas: 5000000
    }, (err, hash) => {
      console.info ('transaction is being mined... ', hash)
      tx = hash
      return (hash)
    })
  } catch (e) {
    return ({
      error: e
    })
  }
  return tx
}



export default {
  sendTx: sendTx,
  mapOnRoot: mapOnRoot
}
