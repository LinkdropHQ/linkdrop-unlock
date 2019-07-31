import { takeEvery } from 'redux-saga/effects'

import createWallet from './every/create-wallet'
import generateLinkERC20 from './every/generate-link-erc20'
import generateLinkERC721 from './every/generate-link-erc721'
import generateLinkERC20Web3 from './every/generate-link-erc20-web3'
import generateLinkERC721Web3 from './every/generate-link-erc721-web3'

export default function * () {
  yield takeEvery('*USER.CREATE_WALLET', createWallet)
  yield takeEvery('*USER.GENERATE_LINK_ERC20', generateLinkERC20)
  yield takeEvery('*USER.GENERATE_LINK_ERC721', generateLinkERC721)
  // web3 provider to generate link
  yield takeEvery('*USER.GENERATE_LINK_ERC20_WEB3', generateLinkERC20Web3)
  yield takeEvery('*USER.GENERATE_LINK_ERC721_WEB3', generateLinkERC721Web3)
}
