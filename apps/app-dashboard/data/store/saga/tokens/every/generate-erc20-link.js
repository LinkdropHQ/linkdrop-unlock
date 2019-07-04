import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import configs from 'config-demo'
import LinkdropFactory from 'contracts/LinkdropFactory.json'
import { factory, claimHost, jsonRpcUrl } from 'app.config.js'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { chainId, currentAddress } = payload
    const balance = yield select(generator.selectors.ethAmount)
    const linksAmount = yield select(generator.selectors.linksAmount)
    const balanceDivided = Number(balance) / Number(linksAmount)
    const weiAmount = utils.parseEther(String(balanceDivided))
    const privateKey = yield select(generator.selectors.privateKey)
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
    const version = yield factoryContract.getProxyMasterCopyVersion(currentAddress)
    const link = yield LinkdropSDK.generateLink({
      jsonRpcUrl,
      chainId,
      host: claimHost,
      linkdropMasterPrivateKey: privateKey,
      weiAmount,
      tokenAddress: ethersContractZeroAddress,
      tokenAmount: 0,
      expirationTime: configs.expirationTime,
      isApprove: 'false',
      version: String(version.toNumber())
    })
    const links = yield select(generator.selectors.links)
    const linksUpdated = links.concat(link.url)

    yield put({ type: 'CAMPAIGNS.SET_LINKS', payload: { links: linksUpdated } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  ethAmount: ({ campaigns: { ethAmount } }) => ethAmount,
  linksAmount: ({ campaigns: { linksAmount } }) => linksAmount,
  privateKey: ({ user: { privateKey } }) => privateKey,
  links: ({ campaigns: { links } }) => links
}
