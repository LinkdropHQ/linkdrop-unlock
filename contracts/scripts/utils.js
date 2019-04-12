import { utils } from 'ethers'
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

export const computeProxyAddress = (factoryAddress, sender, implementation) => {
  const salt = utils.solidityKeccak256(['address'], [sender])

  // /let bytecode = `0x${Linkdrop.bytecode}`
  const bytecode = `0x3d602d80600a3d3981f3363d3d373d3d3d363d73${implementation.slice(
    2
  )}5af43d82803e903d91602b57fd5bf3`

  const proxyAddress = buildCreate2Address(factoryAddress, salt, bytecode)

  console.log({
    salt,
    factoryAddress,
    proxyAddress
  })
  return proxyAddress
}
