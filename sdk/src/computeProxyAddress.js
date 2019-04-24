import { buildCreate2Address } from './utils'
const ethers = require('ethers')

export const computeProxyAddress = (
  factoryAddress,
  senderAddress,
  masterCopyAddress
) => {
  const salt = ethers.utils.solidityKeccak256(['address'], [senderAddress])

  const bytecode = `0x3d602d80600a3d3981f3363d3d373d3d3d363d73${masterCopyAddress.slice(
    2
  )}5af43d82803e903d91602b57fd5bf3`

  const proxyAddress = buildCreate2Address(factoryAddress, salt, bytecode)
  return proxyAddress
}
