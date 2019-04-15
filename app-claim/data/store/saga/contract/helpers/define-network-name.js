export default ({ networkId }) => NETWORK_IDS[`_${networkId}`]

const NETWORK_IDS = {
  _1: 'homestead',
  _3: 'ropsten',
  _4: 'rinkeby'
}
