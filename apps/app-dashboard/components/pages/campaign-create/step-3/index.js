import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Icons, Loading } from 'linkdrop-ui-kit'
import { Button, Input } from 'components/common'

@actions(({
  user: {
    loading,
    currentAddress,
    errors,
    chainId
  },
  tokens: {
    ethBalanceFormatted
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
  errors,
  tokenSymbol,
  loading,
  currentAddress,
  metamaskStatus,
  chainId,
  ethBalanceFormatted
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

  componentWillReceiveProps ({ metamaskStatus, errors, ethBalanceFormatted }) {
    const { metamaskStatus: prevMetamaskStatus, errors: prevErrors, ethBalanceFormatted: prevEthBalanceFormatted, currentAddress, chainId } = this.props
    if (metamaskStatus && metamaskStatus === 'finished' && metamaskStatus !== prevMetamaskStatus) {
      this.intervalCheck = window.setInterval(_ => this.actions().tokens.getEthBalance({ account: currentAddress, chainId }), 3000)
      return
    }
    if (errors && errors[0] && prevErrors.length === 0 && errors[0] !== prevErrors[0]) {
      window.alert(this.t(`errors.${errors[0]}`))
      this.intervalCheck && window.clearInterval(this.intervalCheck)
    }
    if (ethBalanceFormatted && Number(ethBalanceFormatted) > 0 && ethBalanceFormatted !== prevEthBalanceFormatted) {
      this.intervalCheck && window.clearInterval(this.intervalCheck)
      window.alert('found!')
      window.setTimeout(_ => this.actions().user.setStep({ step: 5 }), 3000)
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
                  {this.renderLinkContents({ ethAmount, tokenAmount, linksAmount, tokenSymbol })}
                </div>

              </div>
              {tokenAmount && this.renderEthAmoundData({ ethAmount, linksAmount })}
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
          const { ethAmount, currentAddress } = this.props
          this.actions().metamask.sendEth({ ethAmount: ethAmount * linksAmount, account: currentAddress })
          // this.actions().campaigns.proceedPayment({})
        }}>{this.t('buttons.next')}</Button>
      </div>
    </div>
  }

  setField ({ value, field }) {
    this.setState({
      [field]: value
    })
  }

  renderEthAmoundData ({ ethAmount, linksAmount }) {
    if (!ethAmount || Number(ethAmount) === 0) { return null }
    return <div className={styles.data}>
      <h3 className={styles.dataTitle}>
        {this.t('titles.totalEthInLinks')}
      </h3>
      <div className={styles.dataContent}>
        {ethAmount * linksAmount} ETH
      </div>
      <div className={styles.extraDataContent}>
        {this.t('titles.ethHold')}
      </div>
    </div>
  }

  renderLinkContents ({ tokenAmount, tokenSymbol, ethAmount, linksAmount }) {
    if (ethAmount && !tokenAmount && tokenSymbol === 'ETH') {
      return <p className={styles.dataContent}>
        {this.t('titles.oneLinkContents', { tokenAmount: ethAmount, tokenSymbol })}
      </p>
    }
    if (!ethAmount || Number(ethAmount) === 0) {
      return <p className={styles.dataContent}>
        {this.t('titles.oneLinkContents', { tokenAmount, tokenSymbol })}
      </p>
    }
    return <p className={styles.dataContent}>
      {this.t('titles.oneLinkContentsWithEth', { tokenAmount, tokenSymbol, ethAmount })}
    </p>
  }
}

export default Step3

const CONVERSION_RATE = 0.2
