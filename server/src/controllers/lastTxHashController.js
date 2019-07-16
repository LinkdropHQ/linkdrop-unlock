import ClaimTx from '../models/claimTx'
import ClaimTxERC721 from '../models/claimTxERC721'
import { newError } from '../../../scripts/src/utils'
import configs from '../../../configs'
const ethers = require('ethers')
ethers.errors.setLogLevel('error')
const config = configs.get('server')

const { jsonRpcUrl, factory, relayerPrivateKey } = config

if (jsonRpcUrl == null || jsonRpcUrl === '') {
  throw newError('Please provide json rpc url')
}

if (factory == null || factory === '') {
  throw newError('Please provide proxy factory address')
}

if (relayerPrivateKey == null || relayerPrivateKey === '') {
  throw newError('Please provide relayer private key')
}

export const getLastTxHash = async (req, res) => {
  const paramsHash = req.params.paramsHash

  // Check whether a claim tx exists in database
  const claimTx =
    (await ClaimTx.findOne({
      paramsHash
    })) || (await ClaimTxERC721.findOne({ paramsHash }))

  if (claimTx && claimTx.txHash) {
    return res.json({
      success: true,
      txHash: claimTx.txHash
    })
  } else {
    return res.json({
      success: false,
      error: 'No tx found with a given params hash'
    })
  }
}
