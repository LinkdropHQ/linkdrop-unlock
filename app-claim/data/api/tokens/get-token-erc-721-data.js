import fetch from '../fetch'
import config from 'config-claim'

export default ({ tokenAddress, networkId }) => fetch(`${Number(networkId) === 4 ? config.openseaRinkeby : config.openseaMainnet}/api/v1/asset_contract/${tokenAddress}`, { method: 'GET' })
