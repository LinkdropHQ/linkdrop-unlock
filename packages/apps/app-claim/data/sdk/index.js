import LinkdropSDK from '../../../../sdk/src'
export default ({ linkdropMasterAddress, chain, jsonRpcUrl, apiHost, factoryAddress }) => {
  return new LinkdropSDK({
    linkdropMasterAddress,
    chain,
    jsonRpcUrl,
    apiHost,
    factoryAddress
  })
}
