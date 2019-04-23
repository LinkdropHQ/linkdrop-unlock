import { ethers, utils } from 'ethers'

const generator = function * ({ payload }) {
  try {
    const { provider } = payload
    const currentProvider = new ethers.providers.Web3Provider(provider)
    // логика для кошелька

    console.log(currentProvider.eth)

    // let privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123'
    // let wallet = new ethers.Wallet(privateKey, currentProvider)
    // тут друга логика
  } catch (e) {
    console.error(e)
  }
}

export default generator
