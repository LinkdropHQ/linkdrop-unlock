import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
const config = require('../../configs').get('scripts')

export const newError = message => {
  const error = new Error(term.red.bold.str(message))
  return error
}

let {
  jsonRpcUrl,
  linkdropMasterPrivateKey,
  masterCopy,
  factory,
  chainId,
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
  const linkdropMaster = new ethers.Wallet(linkdropMasterPrivateKey, provider)
  return linkdropMaster
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

export const getInitcode = () => {
  return '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'
}
