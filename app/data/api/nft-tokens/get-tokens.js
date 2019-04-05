import fetch from '../fetch'
import { prepareGetParams } from 'data/api/helpers'

export default ({ wallet, orderBy = 'current_price', orderDirection = 'asc' }) => {
  const getParams = prepareGetParams({
    order_by: orderBy,
    order_direction: orderDirection,
    owner: wallet
  })
  return fetch(`https://api.opensea.io/api/v1/assets/${getParams}`)
}
