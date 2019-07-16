import { put, select } from 'redux-saga/effects'
const ls = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 5 } })
    const { links } = payload
    const chainId = yield select(generator.selectors.chainId)
    const {
      tokenAmount,
      tokenSymbol,
      ethAmount,
      linksAmount,
      tokenType,
      date,
      proxyAddress
    } = yield select(generator.selectors.campaignData)

    const newCampaign = {
      tokenAmount,
      tokenSymbol,
      ethAmount,
      status: 'active',
      linksAmount,
      tokenType,
      created: date,
      links,
      chainId,
      id: proxyAddress,
      proxyAddress
    }
    const campaigns = yield select(generator.selectors.campaigns)
    const campaignsUpdated = campaigns.concat(newCampaign)
    yield put({ type: 'CAMPAIGNS.SET_ITEMS', payload: { items: campaignsUpdated } })
    const campaignsStringified = JSON.stringify(campaignsUpdated)
    ls && ls.setItem && ls.setItem('campaigns', window.btoa(campaignsStringified))
    yield put({ type: '*CAMPAIGNS.RESET_DATA' })
    yield put({ type: 'CAMPAIGNS.SET_CURRENT', payload: { current: proxyAddress } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  campaigns: ({ campaigns: { items: campaigns } }) => campaigns,
  chainId: ({ user: { chainId } }) => chainId,
  campaignData: ({
    campaigns: {
      tokenAmount,
      tokenSymbol,
      ethAmount,
      linksAmount,
      tokenType,
      date,
      id,
      proxyAddress
    }
  }) => ({
    tokenAmount,
    tokenSymbol,
    ethAmount,
    linksAmount,
    tokenType,
    date,
    id,
    proxyAddress
  })
}
