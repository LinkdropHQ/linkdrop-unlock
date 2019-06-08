import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
const config = require('../../configs').get('scripts')

export const newError = message => {
  const error = new Error(term.red.bold.str(message))
  return error
}

let {
  jsonRpcUrl,
  host,
  chainId,
  version,
  linkdropMasterPrivateKey,
  masterCopy,
  factory,
  receiverAddress,
  weiAmount,
  tokenAddress,
  tokenAmount,
  nftAddress,
  nftIds,
  linksNumber,
  isApprove
} = config

export const getIsApprove = () => {
  if (
    isApprove === null ||
    (String(isApprove) !== 'true' && String(isApprove) !== 'false')
  ) {
    throw newError('Please provide valid isApprove argument')
  }
  return isApprove
}

export const getLinksNumber = () => {
  if (linksNumber === null || linksNumber === '') {
    throw newError('Please provide links number')
  }
  return linksNumber
}

export const getLinkdropMasterWallet = () => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw newError('Please provide JSON RPC url')
  }

  // Make sure we have these set in config.json
  if (linkdropMasterPrivateKey == null || linkdropMasterPrivateKey === '') {
    throw newError(`Please provide linkdrop master's private key`)
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const linkdropMasterWallet = new ethers.Wallet(
    linkdropMasterPrivateKey,
    provider
  )
  return linkdropMasterWallet
}

export const getProvider = () => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw newError('Please provide JSON RPC url')
  }
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  return provider
}

export const getMasterCopyAddress = () => {
  if (masterCopy == null || masterCopy === '') {
    throw newError('Please provide linkdrop master copy address')
  }
  return masterCopy
}

export const getFactoryAddress = () => {
  if (factory == null || factory === '') {
    throw newError('Please provide factory contract address')
  }
  return factory
}

export const getChainId = () => {
  if (chainId == null || chainId === '') {
    throw newError('Please provide chain id')
  }
  return chainId
}

export const getInitCode = () => {
  return '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'
}

export const getJsonRpcUrl = () => {
  return jsonRpcUrl
}

export const getMasterCopyVersion = () => {
  return version
}

export const getReceiverAddress = () => {
  return receiverAddress
}

export const getWeiAmount = () => {
  return weiAmount
}

export const getTokenAddress = () => {
  return tokenAddress
}

export const getNftAddress = () => {
  return nftAddress
}

export const getHost = () => {
  return host
}

export const getLinkdropMasterPrivateKey = () => {
  return linkdropMasterPrivateKey
}

export const getNftIds = () => {
  return nftIds
}

export const getTokenAmount = () => {
  return tokenAmount
}

export const getExpirationTime = () => {
  return 12345678910
}

const JSON_RPC_URL = getJsonRpcUrl()
const HOST = getHost()
const LINKDROP_MASTER_PRIVATE_KEY = getLinkdropMasterPrivateKey()
const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()
const LINKDROP_FACTORY_ADDRESS = getFactoryAddress()
const NFT_ADDRESS = getNftAddress()
const TOKEN_ADDRESS = getTokenAddress()
const WEI_AMOUNT = getWeiAmount()
const TOKEN_AMOUNT = getTokenAmount()
const NFT_IDS = getNftIds()
const LINKS_NUMBER = getLinksNumber()
const RECEIVER_ADDRESS = getReceiverAddress()
const LINKDROP_MASTER_COPY_VERSION = getMasterCopyVersion()
const LINKDROP_MASTER_COPY_ADDRESS = getMasterCopyAddress()
const INIT_CODE = getInitCode()
const CHAIN_ID = getChainId()
const EXPIRATION_TIME = getExpirationTime()
const IS_APPROVE = getIsApprove()
const PROVIDER = getProvider()
