import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Button } from 'components/common'
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
      chainId,
      tokenType,
      currentAddress,
      address
    } = this.props

    if (metamaskStatus && metamaskStatus === 'finished' && metamaskStatus !== prevMetamaskStatus) {
      return this.setState({
        loading: true
      }, _ => {
        this.intervalEthCheck = window.setInterval(_ => this.actions().tokens.getEthBalance({ account: proxyAddress, chainId }), config.balanceCheckInterval)
        if (tokenType === 'erc20') {
          this.intervalErc20Check = window.setInterval(_ => this.actions().tokens.getERC20Balance({ chainId, tokenAddress: address, account: proxyAddress, currentAddress }), config.balanceCheckInterval)
        }
      })
    }
    if (errors && errors[0] && prevErrors.length === 0 && errors[0] !== prevErrors[0]) {
      window.alert(this.t(`errors.${errors[0]}`))
      this.setState({
        loading: false
      }, _ => {
        this.intervalEthCheck && window.clearInterval(this.intervalEthCheck)
        this.intervalErc20Check && window.clearInterval(this.intervalErc20Check)
      })
    }

    if (tokenType === 'eth') {
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

    if (tokenType === 'erc20') {
      if ((ethBalanceFormatted && Number(ethBalanceFormatted) > 0) && (erc20BalanceFormatted && Number(erc20BalanceFormatted) > 0)) {
        this.setState({
          loading: false
        }, _ => {
          this.intervalEthCheck && window.clearInterval(this.intervalEthCheck)
          this.intervalErc20Check && window.clearInterval(this.intervalErc20Check)
          window.alert('found All Tokens!')
          window.setTimeout(_ => this.actions().user.setStep({ step: 5 }), config.nextStepTimeout)
        })
      }
    }
  }

  render () {
    const { loading: stateLoading } = this.state
    const { linksAmount, ethAmount, currentAddress, tokenType, tokenAmount, loading } = this.props
    return <div className={styles.container}>
      {(loading || stateLoading) && <Loading withOverlay />}
      <div className={styles.title}>{this.t('titles.sendEth', { ethAmount: ethAmount * linksAmount })}</div>
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
            if (ethAmount && tokenType === 'erc20') {
              this.actions().metamask.sendErc20WithEth({ tokenAmount: tokenAmount * linksAmount, account: currentAddress, ethAmount: ethAmount * linksAmount })
            } else if (ethAmount && tokenType === 'eth') {
              this.actions().metamask.sendEth({ ethAmount: ethAmount * linksAmount, account: currentAddress })
            }
          }}
        >
          {this.t('buttons.send')}
        </Button>
      </div>
    </div>
  }
}

export default Step4
