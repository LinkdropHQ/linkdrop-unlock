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

export const IS_APPROVE = (() => {
  if (
    isApprove === null ||
    (String(isApprove) !== 'true' && String(isApprove) !== 'false')
  ) {
    throw newError('Please provide valid isApprove argument')
  }
  return isApprove
})()

export const LINKS_NUMBER = (() => {
  if (linksNumber === null || linksNumber === '') {
    throw newError('Please provide links number')
  }
  return linksNumber
})()

export const LINKDROP_MASTER_WALLET = (() => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw newError('Please provide JSON RPC url')
  }

  // Make sure we have these set in config.json
  if (linkdropMasterPrivateKey == null || linkdropMasterPrivateKey === '') {
    throw newError(`Please provide linkdrop master's private key`)
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const linkdropMaster = new ethers.Wallet(linkdropMasterPrivateKey, provider)
  return linkdropMaster
})()

export const PROVIDER = (() => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw newError('Please provide JSON RPC url')
  }
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  return provider
})()

export const LINKDROP_MASTER_COPY_ADDRESS = (() => {
  if (masterCopy == null || masterCopy === '') {
    throw newError('Please provide linkdrop master copy address')
  }
  return masterCopy
})()

export const LINKDROP_FACTORY_ADDRESS = (() => {
  if (factory == null || factory === '') {
    throw newError('Please provide factory contract address')
  }
  return factory
})()

export const CHAIN_ID = (() => {
  if (chainId == null || chainId === '') {
    throw newError('Please provide chain id')
  }
  return chainId
})()

export const INIT_CODE = (() => {
  return '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'
})()

export const JSON_RPC_URL = (() => {
  return jsonRpcUrl
})()

export const LINKDROP_MASTER_COPY_VERSION = (() => {
  return version
})()

export const RECEIVER_ADDRESS = (() => {
  return receiverAddress
})()

export const WEI_AMOUNT = (() => {
  return weiAmount
})()

export const TOKEN_ADDRESS = (() => {
  return tokenAddress
})()

export const NFT_ADDRESS = (() => {
  return nftAddress
})()

export const HOST = (() => {
  return host
})()

export const LINKDROP_MASTER_PRIVATE_KEY = (() => {
  return linkdropMasterPrivateKey
})()

export const NFT_IDS = (() => {
  return nftIds
})()

export const TOKEN_AMOUNT = (() => {
  return tokenAmount
})()

export const EXPIRATION_TIME = (() => {
  return 12345678910
})()

export default {
  JSON_RPC_URL,
  HOST,
  LINKDROP_MASTER_PRIVATE_KEY,
  LINKDROP_MASTER_WALLET,
  LINKDROP_FACTORY_ADDRESS,
  NFT_ADDRESS,
  TOKEN_ADDRESS,
  WEI_AMOUNT,
  TOKEN_AMOUNT,
  NFT_IDS,
  LINKS_NUMBER,
  RECEIVER_ADDRESS,
  LINKDROP_MASTER_COPY_VERSION,
  LINKDROP_MASTER_COPY_ADDRESS,
  INIT_CODE,
  CHAIN_ID,
  EXPIRATION_TIME,
  IS_APPROVE,
  PROVIDER
}

/*
{
  JSON_RPC_URL,
  HOST,
  LINKDROP_MASTER_PRIVATE_KEY,
  LINKDROP_MASTER_WALLET,
  LINKDROP_FACTORY_ADDRESS,
  NFT_ADDRESS,
  TOKEN_ADDRESS,
  WEI_AMOUNT,
  TOKEN_AMOUNT,
  NFT_IDS,
  LINKS_NUMBER,
  RECEIVER_ADDRESS,
  LINKDROP_MASTER_COPY_VERSION,
  LINKDROP_MASTER_COPY_ADDRESS,
  INIT_CODE,
  CHAIN_ID,
  EXPIRATION_TIME,
  IS_APPROVE,
  PROVIDER,

}
*/
