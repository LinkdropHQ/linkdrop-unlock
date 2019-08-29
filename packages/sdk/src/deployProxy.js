import LinkdropFactory from '@linkdrop/contracts/build/LinkdropFactory.json'
const ethers = require('ethers')

export const connectToFactoryContract = async ({
  jsonRpcUrl,
  factoryAddress,
  signingKeyOrWallet
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error(`Please provide json rpc url`)
  }
  if (factoryAddress === null || factoryAddress === '') {
    throw new Error(`Please provide factory address`)
  }
  if (signingKeyOrWallet === null || signingKeyOrWallet === '') {
    throw new Error(`Please provide signing key or wallet`)
  }
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  let wallet
  if (typeof signingKeyOrWallet === 'string') {
    wallet = new ethers.Wallet(signingKeyOrWallet, provider)
  } else if (typeof signingKeyOrWallet === 'object') {
    wallet = signingKeyOrWallet
  }

  return new ethers.Contract(factoryAddress, LinkdropFactory.abi, wallet)
}

export const deployProxy = async ({
  jsonRpcUrl,
  factoryAddress,
  signingKeyOrWallet,
  campaignId
}) => {
  const factoryContract = await connectToFactoryContract({
    jsonRpcUrl,
    factoryAddress,
    signingKeyOrWallet
  })

  return factoryContract.deployProxy(campaignId)
}
