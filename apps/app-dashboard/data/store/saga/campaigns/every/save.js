import { put, select } from 'redux-saga/effects'
const ls = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    const { links } = payload
    const {
      tokenAmount,
      tokenSymbol,
      ethAmount,
      linksAmount,
      tokenType,
      date
    } = yield select(generator.selectors.campaignData)
    const newCampaignId = +(date)
    const newCampaign = {
      tokenAmount,
      tokenSymbol,
      ethAmount,
      status: 'active',
      linksAmount,
      tokenType,
      created: date,
      links,
      id: newCampaignId
    }
    const campaigns = yield select(generator.selectors.campaigns)
    const campaignsUpdated = campaigns.concat(newCampaign)
    yield put({ type: 'CAMPAIGNS.SET_ITEMS', payload: { items: campaignsUpdated } })
    const campaignsStringified = JSON.stringify(campaignsUpdated)
    ls && ls.setItem && ls.setItem('campaigns', window.btoa(campaignsStringified))
    yield put({ type: 'CAMPAIGNS.RESET_DATA' })
    yield put({ type: 'CAMPAIGNS.SET_CURRENT', payload: { current: newCampaignId } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 6 } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  campaigns: ({ campaigns: { items: campaigns } }) => campaigns,
  campaignData: ({
    campaigns: {
      tokenAmount,
      tokenSymbol,
      ethAmount,
      linksAmount,
      tokenType,
      date
    }
  }) => ({
    tokenAmount,
    tokenSymbol,
    ethAmount,
    linksAmount,
    tokenType,
    date
  })
}
