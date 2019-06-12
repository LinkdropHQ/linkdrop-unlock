import LinkdropSDK from '../../sdk/src/index'
import { terminal as term } from 'terminal-kit'

import { newError, getChainId, getLinksNumber, getIsApprove } from './utils'
const ethers = require('ethers')
const fs = require('fs')
const fastcsv = require('fast-csv')
const path = require('path')
const configPath = path.resolve(__dirname, '../../configs/scripts.config.json')
const config = require(configPath)

ethers.errors.setLogLevel('error')

let {
  chainId,
  linkdropMasterPrivateKey,
  weiAmount,
  tokenAddress,
  tokenAmount,
  linksNumber,
  jsonRpcUrl,
  host,
  nftAddress,
  nftIds,
  isApprove,
  version
} = config

const expirationTime = 12345678910 // 03/21/2361 @ 7:15pm (UTC)
