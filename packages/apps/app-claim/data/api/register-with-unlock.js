import axios from 'axios'

const _getEndpointUrl = (chain) => {
  let url
  if (String(chain) === '1') {
    url = 'http://locksmith.unlock-protocol.com/api/linkdrop/transaction'
  } else if (String(chain) === '4') {
    url = 'http://rinkeby.locksmith.unlock-protocol.com/api/linkdrop/transaction'
  } else {
    console.log('Unknown chain Id: ', chain)
    throw new Error('Unknown chain Id: ', chain)
  }
  return url
}

// "transactionHash":<Transaction HASH>,
// "chain" : <Ethereum Chain id (1 OR 4) >,
// "sender": <Address issuing the key purchase>,
// "recipient": <Address of Lock Contract>,
// "for":"<Address of Unlock Key(NFT) Recipient>",
// "txData":"<Data of the Transaction>
// //
const registerWithUnlock = async ({ transactionHash, chain, sender, recipient, for_, txData }) => {
  try { 
    const endpoint = _getEndpointUrl(chain)
    axios.defaults.headers.post['Content-Type'] = 'application/json'
    const result = await axios.post(endpoint, {
      transactionHash,
      chain,
      sender,
      recipient,
      'for': for_,
      'data': txData
    })
    
    console.log({ result })
  
    return result.data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export default registerWithUnlock
