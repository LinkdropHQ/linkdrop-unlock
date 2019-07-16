import LinkdropSDK from '../../../sdk/src/index'
import configs from '../../../configs'
const config = configs.get('server')
const { factory } = config

class LinkdropService {
  async getProxyAddress(linkdropMasterAddress, campaignId) {
    const linkdropSDK = LinkdropSDK({ linkdropMasterAddress, factory })
    return linkdropSDK.getProxyAddress(campaignId)
  }
}

export default new LinkdropService()
