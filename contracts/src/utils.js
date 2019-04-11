import { utils } from 'ethers'
import Proxy from '../build/Proxy'

const PROXY_BYTECODE = '14723a09acff6d2a60dcdf7aa4aff308fddc160c'

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
  const salt = utils.solidityKeccak256(['address'], [sender])

  let bytecode = `0x${Proxy.bytecode}${PROXY_BYTECODE}`

  const proxyAddress = buildCreate2Address(factoryAddress, salt, bytecode)

  console.log({
    salt,
    factoryAddress,
    proxyAddress
  })

  return proxyAddress
}
