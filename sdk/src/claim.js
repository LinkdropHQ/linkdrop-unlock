import { signReceiverAddress } from './utils'
import { newError } from '../../scripts/src/utils'
import ora from 'ora'
import { terminal as term } from 'terminal-kit'
const ethers = require('ethers')
const axios = require('axios')
export const claim = async ({
  jsonRpcUrl,
  host,
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  version,
  chainId,
  linkKey,
  linkdropMasterAddress,
  linkdropSignerSignature,
  receiverAddress,
  isApprove
}) => {
  if (jsonRpcUrl === null || jsonRpcUrl === '') {
    throw newError('Please provide json rpc url')
  }

  if (host === null || host === '') {
    throw newError('Please provide host')
  }

  if (weiAmount === null || weiAmount === '') {
    throw newError('Please provide amount of eth to claim')
  }

  if (tokenAddress === null || tokenAddress === '') {
    throw newError('Please provide ERC20 token address')
  }

  if (tokenAmount === null || tokenAmount === '') {
    throw newError('Please provide amount of tokens to claim')
  }

  if (expirationTime === null || expirationTime === '') {
    throw newError('Please provide expiration time')
  }

  if (version === null || version === '') {
    throw newError('Please provide mastercopy version ')
  }

  if (chainId === null || chainId === '') {
    throw newError('Please provide chain id')
  }

  if (linkKey === null || linkKey === '') {
    throw newError('Please provide link key')
  }

  if (linkdropMasterAddress === null || linkdropMasterAddress === '') {
    throw newError('Please provide linkdropMaster address')
  }

  if (linkdropSignerSignature === null || linkdropSignerSignature === '') {
    throw newError('Please provide linkdropMaster signature')
  }

  if (receiverAddress === null || receiverAddress === '') {
    throw newError('Please provide receiver address')
  }

  if (isApprove) {
    if (String(isApprove) !== 'true' && String(isApprove) !== 'false') {
      throw newError('Please provide valid isApprove argument')
    }
  }

  // Get provider
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  // Get receiver signature
  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)

  // Get linkId from linkKey
  const linkId = new ethers.Wallet(linkKey, provider).address

  const claimParams = {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    version,
    chainId,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    isApprove
  }
  try {
    const response = await axios.post(
      `${host}/api/v1/linkdrops/claim`,
      claimParams
    )

    if (response.status !== 200) {
      throw newError(
        term.red.bold.str(`Invalid response status ${response.status}`)
      )
    } else {
      const { error, success, txHash } = response.data
      return { error, success, txHash }
    }
  } catch (err) {
    throw newError(err)
  }
}

export const claimERC721 = async ({
  jsonRpcUrl,
  host,
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  version,
  chainId,
  linkKey,
  linkdropMasterAddress,
  linkdropSignerSignature,
  receiverAddress,
  isApprove
}) => {
  if (jsonRpcUrl === null || jsonRpcUrl === '') {
    throw newError('Please provide json rpc url')
  }

  if (host === null || host === '') {
    throw newError('Please provide host')
  }

  if (weiAmount === null || weiAmount === '') {
    throw newError('Please provide amount of eth to claim')
  }

  if (
    nftAddress === null ||
    nftAddress === '' ||
    nftAddress === ethers.constants.AddressZero
  ) {
    throw newError('Please provide ERC721 token address')
  }

  if (tokenId === null || tokenId === '') {
    throw newError('Please provide token id to claim')
  }

  if (expirationTime === null || expirationTime === '') {
    throw newError('Please provide expiration time')
  }

  if (version === null || version === '') {
    throw newError('Please provide mastercopy version ')
  }

  if (chainId === null || chainId === '') {
    throw newError('Please provide chain id')
  }

  if (linkKey === null || linkKey === '') {
    throw newError('Please provide link key')
  }

  if (linkdropMasterAddress === null || linkdropMasterAddress === '') {
    throw newError('Please provide linkdropMaster address')
  }

  if (linkdropSignerSignature === null || linkdropSignerSignature === '') {
    throw newError('Please provide linkdropMaster signature')
  }

  if (receiverAddress === null || receiverAddress === '') {
    throw newError('Please provide receiver address')
  }

  if (isApprove) {
    if (String(isApprove) !== 'true' && String(isApprove) !== 'false') {
      throw newError('Please provide valid isApprove argument')
    }
  }

  // Get provider
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  // Get receiver signature
  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)

  // Get linkId from linkKey
  const linkId = new ethers.Wallet(linkKey, provider).address

  const claimParams = {
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    version,
    chainId,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    isApprove
  }
  try {
    const response = await axios.post(
      `${host}/api/v1/linkdrops/claim-erc721`,
      claimParams
    )
    if (response.status !== 200) {
      throw newError(`Invalid response status ${response.status}`)
    } else {
      const { error, success, txHash } = response.data
      return { error, success, txHash }
    }
  } catch (err) {
    throw newError(err)
  }
}
