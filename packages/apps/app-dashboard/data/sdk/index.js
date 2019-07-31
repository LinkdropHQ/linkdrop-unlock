import LinkdropSDK from '@linkdrop/sdk/src/index'
export default ({ linkdropMasterAddress, chainId, jsonRpcUrl, apiHost, factoryAddress }) => LinkdropSDK({
  linkdropMasterAddress,
  chain: chainId,
  jsonRpcUrl,
  apiHost,
  factoryAddress
})
