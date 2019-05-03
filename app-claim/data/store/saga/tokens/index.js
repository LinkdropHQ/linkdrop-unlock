import { takeEvery } from 'redux-saga/effects'

import claimTokensERC20 from './every/claim-tokens-erc20'
import claimTokensERC721 from './every/claim-tokens-erc721'
import checkTransactionStatus from './every/check-transaction-status'

export default function * () {
  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC20', claimTokensERC20)
  yield takeEvery('*TOKENS.CLAIM_TOKENS_ERC721', claimTokensERC721)
  yield takeEvery('*TOKENS.CHECK_TRANSACTION_STATUS', checkTransactionStatus)
}
