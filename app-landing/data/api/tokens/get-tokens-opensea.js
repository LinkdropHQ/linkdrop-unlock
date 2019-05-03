import fetch from '../fetch'
import { prepareGetParams } from 'data/api/helpers'
import configs from 'config-landing'

export default ({ wallet, orderBy = 'current_price', orderDirection = 'asc', networkId }) => {
  const getParams = prepareGetParams({
    order_by: orderBy,
    order_direction: orderDirection,
    owner: wallet
  })
  const host = networkId === 4 ? configs.openseaRinkeby : configs.openseaMainnet
  return fetch(`${host}/api/v1/assets/${getParams}`)
}
