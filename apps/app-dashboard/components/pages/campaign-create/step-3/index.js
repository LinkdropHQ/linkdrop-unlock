import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Icons, Loading } from 'linkdrop-ui-kit'
import { Button, Input } from 'components/common'
import EthAmountData from './eth-amount-data'
import LinkContents from './link-contents'

@actions(({
  user: {
    loading,
    currentAddress,
    errors,
    chainId,
    proxyAddress
  },
  tokens: {
    ethBalanceFormatted,
    erc20BalanceFormatted,
    tokenType,
    address
  },
  metamask: {
    status: metamaskStatus
  },
  campaigns: {
    ethAmount,
    tokenAmount,
    linksAmount,
    tokenSymbol
  } }) => ({
  ethAmount,
  tokenAmount,
  linksAmount,
  address,
  errors,
  tokenSymbol,
  loading,
  currentAddress,
  metamaskStatus,
  chainId,
  ethBalanceFormatted,
  proxyAddress,
  tokenType,
  erc20BalanceFormatted
})
)
@translate('pages.campaignCreate')
class Step3 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cardNumber: '0000 0000 0000 0000'
    }
  }

  componentWillReceiveProps ({ metamaskStatus, errors, ethBalanceFormatted, erc20BalanceFormatted }) {
    const {
      metamaskStatus: prevMetamaskStatus,
      errors: prevErrors,
      ethBalanceFormatted: prevEthBalanceFormatted,
      erc20BalanceFormatted: prevErc20BalanceFormatted,
      proxyAddress,
      chainId,
      tokenType,
      address: tokenAddress,
      ethAmount
    } = this.props

    if (metamaskStatus && metamaskStatus === 'finished' && metamaskStatus !== prevMetamaskStatus) {
      if (tokenType === 'eth') {
        this.intervalCheck = window.setInterval(_ => this.actions().tokens.getEthBalance({ account: proxyAddress, chainId }), 3000)
      } else if (tokenType === 'erc20' && !ethAmount) {
        this.intervalCheck = window.setInterval(_ => this.actions().tokens.getERC20Balance({ chainId, tokenAddress, account: proxyAddress }), 3000)
      }
      // тут будет логика проверки для эфира и токена одновремнно
      return
    }
    if (errors && errors[0] && prevErrors.length === 0 && errors[0] !== prevErrors[0]) {
      window.alert(this.t(`errors.${errors[0]}`))
      this.intervalCheck && window.clearInterval(this.intervalCheck)
    }

    if (tokenType === 'eth') {
      if (ethBalanceFormatted && Number(ethBalanceFormatted) > 0 && ethBalanceFormatted !== prevEthBalanceFormatted) {
        this.intervalCheck && window.clearInterval(this.intervalCheck)
        window.alert('found ETH!')
        window.setTimeout(_ => this.actions().user.setStep({ step: 5 }), 1000)
      }
    }

    if (tokenType === 'erc20') {
      if (erc20BalanceFormatted && Number(erc20BalanceFormatted) > 0 && erc20BalanceFormatted !== prevErc20BalanceFormatted) {
        this.intervalCheck && window.clearInterval(this.intervalCheck)
        window.alert('found ERC20!')
        window.setTimeout(_ => this.actions().user.setStep({ step: 5 }), 1000)
      }
    }
  }

  render () {
    const { ethAmount, tokenAmount, linksAmount, tokenSymbol, loading } = this.props
    const { cardNumber } = this.state
    return <div className={styles.container}>
      {loading && <Loading withOverlay />}
      <div className={styles.title}>{this.t('titles.summaryPay')}</div>
      <div className={styles.main}>
        <div className={styles.summary}>
          <div className={styles.summaryBox}>
            <div>
              <div className={styles.data}>
                <h3 className={styles.dataTitle}>
                  {this.t('titles.linksToGenerate')}
                </h3>

                <div className={styles.dataContent}>
                  {linksAmount}
                </div>
              </div>
              <div className={styles.data}>
                <h3 className={styles.dataTitle}>
                  {this.t('titles.serviceFeeTitle')}
                </h3>
                <div className={styles.dataContent}>
                  {`$ ${linksAmount * CONVERSION_RATE}`}
                </div>
                <div className={styles.extraDataContent}>
                  {this.t('titles.centsPerLink', { cents: CONVERSION_RATE * 100 })}
                </div>

              </div>
            </div>

            <div>
              <div className={styles.data}>
                <h3 className={styles.dataTitle}>
                  {this.t('titles.oneLinkContainsTitle')}
                </h3>
                <div className={styles.dataContent}>
                  <LinkContents ethAmount={ethAmount} tokenAmount={tokenAmount} tokenSymbol={tokenSymbol} />
                </div>

              </div>
              <EthAmountData ethAmount={ethAmount} linksAmount={linksAmount} tokenAmount={tokenAmount} />
            </div>
          </div>

          {false && <div className={styles.payment}>
            <div className={styles.priceSummary} dangerouslySetInnerHTML={{ __html: this.t('titles.charge', { price: CONVERSION_RATE * 10 * linksAmount }) }} />
            <div className={styles.methods}>{this.t('titles.methods')} <Icons.Lock /></div>
            <Input format='#### #### #### ####' numberInput onChange={({ value }) => this.setField({ field: 'cardNumber', value })} className={styles.input} value={cardNumber} />
          </div>}
        </div>
        <div className={styles.description}>
          <p className={styles.text}>{this.t('texts._6')}</p>
          <p className={styles.text}>{this.t('texts._7')}</p>
          <p className={styles.text}>{this.t('texts._8')}</p>
        </div>
      </div>

      <div className={styles.controls}>
        <Button onClick={_ => {
          const { ethAmount, currentAddress, tokenType } = this.props
          console.log({ tokenType })
          if (tokenType === 'eth') {
            this.actions().metamask.sendEth({ ethAmount: ethAmount * linksAmount, account: currentAddress })
          } else if (tokenType === 'erc20') {
            this.actions().metamask.sendErc20({ tokenAmount: tokenAmount * linksAmount, ethAmount: ethAmount * linksAmount, account: currentAddress })
          }
        }}>
          {this.t('buttons.next')}
        </Button>
      </div>
    </div>
  }

  setField ({ value, field }) {
    this.setState({
      [field]: value
    })
  }
}

export default Step3

const CONVERSION_RATE = 0.2
