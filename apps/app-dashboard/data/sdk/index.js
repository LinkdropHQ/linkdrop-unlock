import LinkdropSDK from 'sdk/src/index'
export default ({ linkdropMasterAddress, chainId, jsonRpcUrl, apiHost }) => LinkdropSDK({
  linkdropMasterAddress,
  chain: chainId,
  jsonRpcUrl,
  apiHost
})
