import { takeEvery } from 'redux-saga/effects'

import createWallet from './every/create-wallet'
import generateLinkERC20 from './every/generate-link-erc20'
import generateLinkERC721 from './every/generate-link-erc721'

export default function * () {
  yield takeEvery('*USER.CREATE_WALLET', createWallet)
  yield takeEvery('*USER.GENERATE_LINK_ERC20', generateLinkERC20)
  yield takeEvery('*USER.GENERATE_LINK_ERC721', generateLinkERC721)
}
