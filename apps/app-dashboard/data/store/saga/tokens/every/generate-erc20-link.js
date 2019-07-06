import { put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { utils } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import configs from 'config-dashboard'
import { claimHost, jsonRpcUrl } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { chainId, currentAddress } = payload
    const erc20Balance = yield select(generator.selectors.tokenAmount)
    const decimals = yield select(generator.selectors.decimals)
    const erc20BalanceFormatted = utils.parseUnits(String(erc20Balance), decimals)
    const privateKey = yield select(generator.selectors.privateKey)
    const tokenAddress = yield select(generator.selectors.tokenAddress)
    const version = yield select(generator.selectors.version)
    const link = yield LinkdropSDK.generateLink({
      jsonRpcUrl,
      chainId,
      host: claimHost,
      linkdropSignerPrivateKey: privateKey,
      weiAmount: 0,
      linkdropMasterAddress: currentAddress,
      tokenAddress: tokenAddress,
      tokenAmount: String(erc20BalanceFormatted),
      expirationTime: configs.expirationTime,
      isApprove: 'false',
      version: String(version.toNumber())
    })
    yield delay(100)
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
  tokenAmount: ({ campaigns: { tokenAmount } }) => tokenAmount,
  privateKey: ({ user: { privateKey } }) => privateKey,
  links: ({ campaigns: { links } }) => links,
  decimals: ({ tokens: { decimals } }) => decimals,
  version: ({ user: { version } }) => version,
  tokenAddress: ({ tokens: { address } }) => address
}
