import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Button, PageHeader } from 'components/common'
import { RetinaImage, Loading } from 'linkdrop-ui-kit'
import { getImages } from 'helpers'
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
  metamaskStatus,
  linksAmount,
  errors,
  tokenSymbol,
  loading,
  currentAddress,
  chainId,
  address,
  proxyAddress,
  tokenType,
  ethBalanceFormatted,
  erc20BalanceFormatted
})
)
@translate('pages.campaignCreate')
class Step4 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentWillReceiveProps ({ metamaskStatus, errors, ethBalanceFormatted, erc20BalanceFormatted }) {
    const {
      metamaskStatus: prevMetamaskStatus,
      errors: prevErrors,
      proxyAddress,
      ethBalanceFormatted: prevEthBalanceFormatted,
      chainId
    } = this.props

    if (metamaskStatus && metamaskStatus === 'finished' && metamaskStatus !== prevMetamaskStatus) {
      return this.setState({
        loading: true
      }, _ => {
        this.intervalEthCheck = window.setInterval(_ => this.actions().tokens.getEthBalance({ account: proxyAddress, chainId }), config.balanceCheckInterval)
      })
    }
    if (errors && errors[0] && prevErrors.length === 0 && errors[0] !== prevErrors[0]) {
      window.alert(this.t(`errors.${errors[0]}`))
      this.setState({
        loading: false
      }, _ => {
        this.intervalEthCheck && window.clearInterval(this.intervalEthCheck)
      })
    }

    if (ethBalanceFormatted && Number(ethBalanceFormatted) > 0 && ethBalanceFormatted !== prevEthBalanceFormatted) {
      this.setState({
        loading: false
      }, _ => {
        this.intervalEthCheck && window.clearInterval(this.intervalEthCheck)
        window.alert('found ETH!')
        window.setTimeout(_ => this.actions().user.setStep({ step: 5 }), config.nextStepTimeout)
      })
    }
  }

  render () {
    const { loading: stateLoading } = this.state
    const { linksAmount, ethAmount, currentAddress, tokenType, loading } = this.props
    return <div className={styles.container}>
      {(loading || stateLoading) && <Loading withOverlay />}
      <PageHeader title={this.t('titles.sendEth', { ethAmount: ethAmount * linksAmount })} />
      <div className={styles.main}>
        <div className={styles.description}>
          {tokenType === 'erc20' && <p className={classNames(styles.text, styles.textMain)}>{this.t('texts._9')}</p>}
          <p className={styles.text}>{this.t('texts._10')}</p>
          <p className={styles.text}>{this.t('texts._11', { ethAmount: ethAmount * linksAmount })}</p>
        </div>
        <div className={styles.scheme}>
          <p className={classNames(styles.text, styles.centered)}>{this.t('texts._12')}</p>
          <RetinaImage width={255} {...getImages({ src: 'key-preview' })} />
        </div>
      </div>
      <div className={styles.controls}>
        <Button
          disabled={loading || stateLoading}
          onClick={_ => {
            this.actions().metamask.sendEth({ ethAmount: ethAmount * linksAmount, account: currentAddress })
          }}
        >
          {this.t('buttons.send')}
        </Button>
      </div>
    </div>
  }
}

export default Step4
