import fetch from '../fetch'
import { prepareGetParams } from 'data/api/helpers'
import configs from 'config-dashboard'

export default ({ account }) => {
  const getParams = prepareGetParams({
    address: account
  })
  return fetch(`${configs.trustWallet}/tokens${getParams}`)
}
