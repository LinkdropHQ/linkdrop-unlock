export default ({ networkId }) => NETWORK_IDS[`_${networkId}`]

const NETWORK_IDS = {
  _1: 'mainnet',
  _3: 'ropsten',
  _4: 'rinkeby'
}
