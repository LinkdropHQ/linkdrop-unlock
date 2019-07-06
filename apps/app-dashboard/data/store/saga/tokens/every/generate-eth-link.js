import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import configs from 'config-dashboard'
import { claimHost, jsonRpcUrl } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { chainId, currentAddress } = payload
    const balance = yield select(generator.selectors.ethAmount)
    const weiAmount = utils.parseEther(String(Number(balance)))
    const privateKey = yield select(generator.selectors.privateKey)
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const version = yield select(generator.selectors.version)
    const start = +(new Date())
    console.log('start: ', start)
    const link = yield LinkdropSDK.generateLink({
      jsonRpcUrl,
      chainId,
      host: claimHost,
      linkdropSignerPrivateKey: privateKey,
      weiAmount,
      linkdropMasterAddress: currentAddress,
      tokenAddress: ethersContractZeroAddress,
      tokenAmount: 0,
      expirationTime: configs.expirationTime,
      isApprove: 'false',
      version: String(version.toNumber())
    })
    console.log('finished one link generate: ', +(new Date()) - start)
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
  privateKey: ({ user: { privateKey } }) => privateKey,
  links: ({ campaigns: { links } }) => links,
  version: ({ user: { version } }) => version,
  tokenType: ({ tokens: { tokenType } }) => tokenType
}
