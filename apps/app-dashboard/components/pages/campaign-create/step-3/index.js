import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Icons, Loading } from 'linkdrop-ui-kit'
import { Button, Input } from 'components/common'
import EthAmountData from './eth-amount-data'
import LinkContents from './link-contents'
import config from 'config-dashboard'

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
    address
  },
  metamask: {
    status: metamaskStatus
  },
  campaigns: {
    ethAmount,
    tokenAmount,
    linksAmount,
    tokenType,
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
      cardNumber: '0000 0000 0000 0000',
      loading: false
    }
  }

  componentWillReceiveProps ({ metamaskStatus, errors, ethBalanceFormatted, erc20BalanceFormatted }) {
    const {
      metamaskStatus: prevMetamaskStatus,
      errors: prevErrors,
      erc20BalanceFormatted: prevErc20BalanceFormatted,
      proxyAddress,
      chainId,
      address: tokenAddress,
      currentAddress,
      tokenType,
      ethAmount
    } = this.props

    if (metamaskStatus && metamaskStatus === 'finished' && metamaskStatus !== prevMetamaskStatus) {
      this.setState({
        loading: true
      }, _ => {
        this.intervalCheck = window.setInterval(_ => this.actions().tokens.getERC20Balance({ chainId, tokenAddress, account: proxyAddress, currentAddress }), config.balanceCheckInterval)
      })
    }
    if (errors && errors[0] && prevErrors.length === 0 && errors[0] !== prevErrors[0]) {
      this.setState({
        loading: false
      }, _ => {
        window.alert(this.t(`errors.${errors[0]}`))
        this.intervalCheck && window.clearInterval(this.intervalCheck)
      })
    }

    if (erc20BalanceFormatted && Number(erc20BalanceFormatted) > 0 && erc20BalanceFormatted !== prevErc20BalanceFormatted) {
      this.setState({
        loading: false
      }, _ => {
        this.intervalCheck && window.clearInterval(this.intervalCheck)
        window.alert('found ERC20!')
        const nextStep = tokenType === 'eth' || (tokenType === 'erc20' && ethAmount) ? 4 : 5
        window.setTimeout(_ => this.actions().user.setStep({ step: nextStep }), config.nextStepTimeout)
      })
    }
  }

  render () {
    const { ethAmount, tokenType, tokenAmount, linksAmount, tokenSymbol, loading, currentAddress } = this.props
    const { cardNumber, loading: stateLoading } = this.state
    return <div className={styles.container}>
      {(stateLoading || loading) && <Loading withOverlay />}
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
                  {`$ ${linksAmount * config.linkPrice}`}
                </div>
                <div className={styles.extraDataContent}>
                  {this.t('titles.centsPerLink', { cents: config.linkPrice * 100 })}
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
            <div className={styles.priceSummary} dangerouslySetInnerHTML={{ __html: this.t('titles.charge', { price: config.linkPrice * 10 * linksAmount }) }} />
            <div className={styles.methods}>{this.t('titles.methods')} <Icons.Lock /></div>
            <Input format='#### #### #### ####' numberInput onChange={({ value }) => this.setField({ field: 'cardNumber', value })} className={styles.input} value={cardNumber} />
          </div>}
        </div>
        <div className={styles.description}>
          <p className={styles.text}>{this.t('texts._6')}</p>
          <p className={styles.text}>{this.t('texts._7', { price: config.linkPrice * 100 })}</p>
          <p className={styles.text}>{this.t('texts._8')}</p>
        </div>
      </div>

      <div className={styles.controls}>
        <Button onClick={_ => {
          if (tokenType === 'eth') {
            this.actions().user.setStep({ step: 4 })
          } else {
            this.actions().metamask.sendErc20({ tokenAmount: tokenAmount * linksAmount, account: currentAddress })
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
