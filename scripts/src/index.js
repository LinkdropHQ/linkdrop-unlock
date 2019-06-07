import LinkdropMastercopy from '../../contracts/build/LinkdropMastercopy'
import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import TokenMock from '../../contracts/build/TokenMock'
import NFTMock from '../../contracts/build/NFTMock'
import LinkdropSDK from '../../sdk/src/index'

const ethers = require('ethers')
const fs = require('fs')
const fastcsv = require('fast-csv')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/scripts.config.json')
const config = require(configPath)

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

if (jsonRpcUrl == null || jsonRpcUrl === '') {
  throw new Error('Please provide JSON RPC url')
}

// Make sure we have these set in config.json
if (linkdropMasterPrivateKey == null || linkdropMasterPrivateKey === '') {
  throw new Error(`Please provide linkdropMaster's private key`)
}

const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
const linkdropMaster = new ethers.Wallet(linkdropMasterPrivateKey, provider)

const expirationTime = 1900000000000000

let mastercopy, proxyFactory, tokenMock, nftMock

export const deployMasterCopy = async () => {
  let factory = new ethers.ContractFactory(
    LinkdropMastercopy.abi,
    LinkdropMastercopy.bytecode,
    linkdropMaster
  )

  mastercopy = await factory.deploy()

  let txHash = mastercopy.deployTransaction.hash
  console.log(`#️⃣  Tx Hash: ${txHash}`)

  await mastercopy.deployed()
  console.log(`Deployed linkdrop master copy at ${mastercopy.address}\n`)

  config.masterCopy = mastercopy.address

  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw err
    console.log(
      'Master copy address successfully added to scripts.config.json '
    )
  })

  return mastercopy.address
}

export const deployFactory = async (masterCopyAddress, chainId) => {
  let factory = new ethers.ContractFactory(
    LinkdropFactory.abi,
    LinkdropFactory.bytecode,
    linkdropMaster
  )

  proxyFactory = await factory.deploy(masterCopyAddress, chainId, {
    gasLimit: 6000000
  })

  let txHash = proxyFactory.deployTransaction.hash
  console.log(`#️⃣  Tx Hash: ${txHash}`)

  await proxyFactory.deployed()
  console.log(`Deployed proxy factory at ${proxyFactory.address}\n`)

  config.factory = proxyFactory.address
  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw err
    console.log(
      'Proxy factory address successfully added to scripts.config.json '
    )
  })

  return proxyFactory.address
}

export const deployERC20 = async () => {
  let factory = new ethers.ContractFactory(
    TokenMock.abi,
    TokenMock.bytecode,
    linkdropMaster
  )

  tokenMock = await factory.deploy({
    gasLimit: 6000000
  })

  let txHash = tokenMock.deployTransaction.hash
  console.log(`#️⃣  Tx Hash: ${txHash}`)

  await tokenMock.deployed()
  console.log(`Deployed token at ${tokenMock.address}\n`)

  config.tokenAddress = tokenMock.address
  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw err
    console.log(`Token address successfully added to scripts.config.json `)
  })
}

export const deployERC721 = async () => {
  let factory = new ethers.ContractFactory(
    NFTMock.abi,
    NFTMock.bytecode,
    linkdropMaster
  )

  nftMock = await factory.deploy({
    gasLimit: 6000000
  })

  let txHash = nftMock.deployTransaction.hash
  console.log(`#️⃣  Tx Hash: ${txHash}`)

  await nftMock.deployed()
  console.log(`Deployed token at ${nftMock.address}\n`)

  config.nftAddress = nftMock.address
  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw err
    console.log(`NFT address successfully added to scripts.config.json `)
  })
}

export const generateLinksETH = async () => {
  if (chainId === null || chainId === '') {
    throw new Error('Please provide chain id')
  }

  if (linksNumber === null || linksNumber === '') {
    throw new Error('Please provide links number')
  }

  if (
    isApprove === null ||
    (String(isApprove) !== 'true' && String(isApprove) !== 'false')
  ) {
    throw new Error('Please provide valid isApprove argument')
  }

  tokenAddress = ethers.constants.AddressZero
  tokenAmount = 0

  let links = []

  for (let i = 0; i < linksNumber; i++) {
    let {
      url,
      linkId,
      linkKey,
      linkdropSignerSignature
    } = await LinkdropSDK.generateLink({
      jsonRpcUrl,
      chainId,
      host,
      linkdropMasterPrivateKey,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      isApprove
    })

    let link = { i, linkId, linkKey, linkdropSignerSignature, url }
    links.push(link)
  }

  // Save links to csv
  const filename = path.join(__dirname, '../output/linkdrop_eth.csv')

  try {
    const ws = fs.createWriteStream(filename)
    fastcsv.write(links, { headers: true }).pipe(ws)
    console.log(`File ${filename} has been succesfully updated`)
  } catch (err) {
    console.error(err)
  }

  return links
}

export const generateLinksERC20 = async () => {
  if (chainId === null || chainId === '') {
    throw new Error('Please provide chain id')
  }

  if (linksNumber === null || linksNumber === '') {
    throw new Error('Please provide links number')
  }

  if (
    isApprove === null ||
    (String(isApprove) !== 'true' && String(isApprove) !== 'false')
  ) {
    throw new Error('Please provide valid isApprove argument')
  }

  let links = []

  for (let i = 0; i < linksNumber; i++) {
    let {
      url,
      linkId,
      linkKey,
      linkdropSignerSignature
    } = await LinkdropSDK.generateLink({
      jsonRpcUrl,
      chainId,
      host,
      linkdropMasterPrivateKey,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      isApprove
    })

    let link = { i, linkId, linkKey, linkdropSignerSignature, url }
    links.push(link)
  }

  // Save links to csv
  const filename = path.join(__dirname, '../output/linkdrop_erc20.csv')

  try {
    const ws = fs.createWriteStream(filename)
    fastcsv.write(links, { headers: true }).pipe(ws)
    console.log(`File ${filename} has been succesfully updated`)
  } catch (err) {
    console.error(err)
  }

  return links
}

export const generateLinksERC721 = async () => {
  if (chainId === null || chainId === '') {
    throw new Error('Please provide chain id')
  }

  if (nftIds == null || nftIds === '' || nftIds === '[]') {
    throw new Error('Please provide NFT ids')
  }

  if (
    isApprove === null ||
    (String(isApprove) !== 'true' && String(isApprove) !== 'false')
  ) {
    throw new Error('Please provide valid isApprove argument')
  }

  let links = []
  let tokenIds = JSON.parse(nftIds)

  for (let i = 0; i < tokenIds.length; i++) {
    let {
      url,
      linkId,
      linkKey,
      linkdropSignerSignature
    } = await LinkdropSDK.generateLinkERC721({
      jsonRpcUrl,
      chainId,
      host,
      linkdropMasterPrivateKey,
      weiAmount,
      nftAddress,
      tokenId: tokenIds[i],
      expirationTime,
      version,
      isApprove
    })

    let link = { i, linkId, linkKey, linkdropSignerSignature, url }
    links.push(link)
  }
  // Save links to csv
  const filename = path.join(__dirname, '../output/linkdrop_erc721.csv')

  try {
    const ws = fs.createWriteStream(filename)
    fastcsv.write(links, { headers: true }).pipe(ws)
    console.log(`File ${filename} has been succesfully updated`)
  } catch (err) {
    console.error(err)
  }
  return links
}
