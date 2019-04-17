import React from 'react'
import { Loading } from 'linkdrop-ui-kit'
import { actions, translate } from 'decorators'
import InitialPage from './initial-page'
import WalletChoosePage from './wallet-choose-page'
import ClaimingProcessPage from './claiming-process-page'
import ErrorPage from './error-page'
import ClaimingFinishedPage from './claiming-finished-page'

@actions(({ user: { errors, wallet, step, loading: userLoading, transactionId }, contract: { loading, decimals, amount, symbol, icon } }) => ({
  userLoading,
  wallet,
  loading,
  decimals,
  symbol,
  amount,
  icon,
  step,
  transactionId,
  errors
}))
@translate('pages.claim')
class Claim extends React.Component {
  componentDidMount () {
    this.actions().contract.getTokenData({ tokenAddress, amount: a, networkId: n })
  }

  render () {
    return this.renderCurrentPage()
  }

  renderCurrentPage () {
    const { decimals, amount, symbol, icon, wallet, step, userLoading, transactionId, errors } = this.props
    const commonData = { decimals, amount, symbol, icon, wallet, loading: userLoading }
    if (errors && errors.length > 0) {
      return <ErrorPage error={errors[0]} />
    }
    switch (step) {
      case 0:
        return <Loading />
      case 1:
        return <InitialPage
          {...commonData}
          onClick={_ => this.actions().user.setStep({ step: 2 })}
        />
      case 2:
        return <WalletChoosePage onClick={_ => {
          this.actions().user.setStep({ step: 3 })
          this.actions().user.setWallet({ wallet: '0x6C0F58AD4eb24da5769412Bf34dDEe698c4d185b' })
        }} />
      case 3:
        return <InitialPage
          {...commonData}
          onClick={_ => {
            this.actions().tokens.claimTokens()
          }}
        />
      case 4:
        return <ClaimingProcessPage
          {...commonData}
          transactionId={transactionId}
        />
      case 5:
        return <ClaimingFinishedPage
          {...commonData}
          transactionId={transactionId}
        />
      default:
        return <Loading />
    }
  }
}

export default Claim

const tokenAddress = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
const n = '1'
const a = '100000000000000000'
