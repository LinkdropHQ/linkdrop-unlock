import React from 'react'
import { Loading } from 'linkdrop-ui-kit'
import { actions, translate } from 'decorators'
import InitialPage from './initial-page'
import WalletChoosePage from './wallet-choose-page'
import ClaimingProcessPage from './claiming-process-page'
import ErrorPage from './error-page'
import ClaimingFinishedPage from './claiming-finished-page'
import { getHashVariables } from 'helpers'
import { Web3Consumer } from 'web3-react'

@actions(({ user: { errors, step, loading: userLoading, transactionId }, contract: { loading, decimals, amount, symbol, icon } }) => ({
  userLoading,
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
    const { token, amount, expirationTime, n } = getHashVariables()
    // так, вот есть переменные все в урле:
    // token - это адрес контракта,
    // amount - количество токенов,
    // expirationTime - дата окончания дествия линка,
    // sender,
    // senderSignature,
    // linkKey - приватный ключ для линка,
    // n - айдишник сети

    // нужно для клейма
    // sender: sender key address, e.g. 0x1234...ff
    // senderSignature: ECDSA signature signed by sender (contained in claim link)
    // receiverSignature: ECDSA signature signed by receiver using link key

    // destination: destination address - это адрес получается, из стора
    // token: ERC20 token address, 0x000...000 for ether - это из линка
    // tokenAmount: token amount in atomic values - это из линка
    // expirationTime: link expiration time - это из линка

    if (Number(expirationTime) < +(new Date())) {
      // если ссылка просрочилась, то показывать экран ошибки что ссылка исчерпалась уже
      return this.actions().user.setErrors({ errors: ['LINK_EXPIRED'] })
    }
    this.actions().contract.getTokenData({ tokenAddress: token, amount, networkId: n })
  }

  render () {
    return <Web3Consumer>
      {context => this.renderCurrentPage({ context })}
    </Web3Consumer>
  }

  renderCurrentPage ({ context }) {
    const { decimals, amount, symbol, icon, step, userLoading, transactionId, errors } = this.props
    // in context we can find:
    // active,
    // connectorName,
    // connector,
    // library,
    // networkId,
    // account,
    // error
    const {
      account
    } = context
    const commonData = { decimals, amount, symbol, icon, wallet: account, loading: userLoading }
    if (errors && errors.length > 0) {
      return <ErrorPage error={errors[0]} />
    }
    switch (step) {
      case 1:
        return <InitialPage
          {...commonData}
          onClick={_ => {
            if (account) {
              // если уже есть кошелек, то перекидываем на четвертый шаг и клеймим токены там уже
              return this.actions().user.setStep({ step: 2 })
            }
            // если нет кошелька в сторе сейчас, то перекидываем на страницу с выбором кошелька
            this.actions().user.setStep({ step: 2 })
          }}
        />
      case 2:
        // страница выбора кошелька
        return <WalletChoosePage onClick={_ => {
          this.actions().user.setStep({ step: 3 })
        }} />
      case 3:
        // страница показывающая что кошелек выбран и предлагающая забрать токены
        return <InitialPage
          {...commonData}
          onClick={_ => {
            this.actions().user.setStep({ step: 4 })
          }}
        />
      case 4:
        // клэйминг токенов в процессе
        return <ClaimingProcessPage
          {...commonData}
          transactionId={transactionId}
        />
      case 5:
        // клейминг завершен
        return <ClaimingFinishedPage
          {...commonData}
          transactionId={transactionId}
        />
      default:
        // загрузка
        return <Loading />
    }
  }
}

export default Claim
