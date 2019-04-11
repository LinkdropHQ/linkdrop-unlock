import { utils } from 'ethers'
import Proxy from '../build/Proxy'

const addressToBytes32 = address => utils.padZeros(utils.arrayify(address), 32)

function buildCreate2Address (creatorAddress, saltHex, byteCode) {
  const byteCodeHash = utils.keccak256(byteCode)
  return `0x${utils
    .keccak256(
      `0x${['ff', creatorAddress, saltHex, byteCodeHash]
        .map(x => x.replace(/0x/, ''))
        .join('')}`
    )
    .slice(-40)}`.toLowerCase()
}

export const computeProxyAddress = (factoryAddress, sender) => {
  const salt = utils.hexlify(addressToBytes32(sender))

  const bytecode = `0x${Proxy.bytecode}`

  const proxyAddress = buildCreate2Address(factoryAddress, salt, bytecode)

  console.log({
    salt,
    factoryAddress,
    proxyAddress
  })

  return proxyAddress
}
