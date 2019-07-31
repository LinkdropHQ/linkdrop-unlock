import React from 'react'
import { actions, translate } from 'decorators'
import { Button, Icons, ModalWindow } from 'linkdrop-ui-kit'
import styles from './styles.module'
import TokensSend from './tokens-send'
import LinkShare from './link-share'
import ProSolution from './pro-solution'
import FinalScreen from './final-screen'
import LearnMore from './learn-more'
import TrustedBy from './trusted-by'
import ErrorScreen from './error-screen'
import LoadingScreen from './loading-screen'
import MetamaskInjectedScreen from './metamask-injected-screen'
import { getHashVariables, defineNetworkName, capitalize } from 'linkdrop-commons'
import { Web3Consumer } from 'web3-react'

@actions(({ user: { step, wallet, link, errors }, tokens: { balance, assetBalance } }) => ({ assetBalance, step, balance, wallet, link, errors }))
@translate('pages.main')
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      startCheckingBalanceImmediately: false,
      modalShow: true
    }
  }

  componentDidMount () {
    const { chainId = '4' } = getHashVariables()
    const { wallet, account } = this.props
    // if has no wallet, then generate new one
    if (!wallet) {
      return this.actions().user.createWallet({ account })
    }
    // otherwise do the initial check
    this.setState({
      startCheckingBalanceImmediately: true
    }, _ => this.actions().tokens.checkBalance({ account: wallet, chainId }))
  }

  componentWillReceiveProps ({ wallet, step }) {
    const { chainId = '4' } = getHashVariables()
    const { wallet: prevWallet } = this.props
    if (step != null && step === 0 && wallet && wallet !== prevWallet) {
      return this.actions().tokens.checkBalance({ account: wallet, chainId })
    }
  }

  render () {
    const { step, errors } = this.props
    const { modalShow } = this.state
    return <Web3Consumer>
      {context => <div className={styles.container}>
        <ModalWindow visible={modalShow}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{this.t('titles.beCareful')}</h2>
            <div className={styles.modalDescription} dangerouslySetInnerHTML={{ __html: this.t('descriptions.bugBountyNote') }} />
            <Button className={styles.buttonOrange} onClick={_ => this.onModalClose()}>
              {this.t('buttons.understood')}
            </Button>
          </div>
        </ModalWindow>
        <div className={styles.headerContent}>
          <div className={styles.leftBlock}>
            {this.renderContent({ step, errors, context })}
          </div>
          <div className={styles.rightBlock}>
            {this.renderTexts({ step })}
          </div>
        </div>
        {/* currently disabled */}
        {false && <LearnMore />}
        {false && <TrustedBy />}
        {/* currently disabled */}
      </div>}
    </Web3Consumer>
  }

  onModalClose () {
    this.setState({
      modalShow: false
    })
  }

  renderTexts ({ step }) {
    return <div className={styles.texts}>
      <h1 className={styles.mainTitle} dangerouslySetInnerHTML={{ __html: this.t('titles.main') }} />
      {this.renderMainDescription()}
      {this.renderAccess()}
    </div>
  }

  renderMainDescription () {
    return <div className={styles.mainDescription}>
      <div className={styles.listItem}>
        <Icons.CheckSmall /> {this.t('titles.createShare')}
      </div>

      <div className={styles.listItem}>
        <Icons.CheckSmall /> {this.t('titles.noGas')}
      </div>

      <div className={styles.listItem}>
        <Icons.CheckSmall /> {this.t('titles.tokenTypes')}
      </div>
    </div>
  }

  renderAccess () {
    return <div className={styles.form}>
      <div className={styles.formContent}>
        <Button target='_blank' href='http://linkdrop.io/request' className={styles.button}>{this.t('buttons.requestAccess')}</Button>
      </div>
      <div className={styles.formNote}>
        {this.t('titles.wantMoreLinksInstruction')}
      </div>
    </div>
  }

  renderContent ({ step, errors, context }) {
    const { startCheckingBalanceImmediately } = this.state
    const { chainId = '4' } = getHashVariables()
    const {
      networkId,
      account
    } = context
    if (networkId && account && Number(networkId) !== Number(chainId)) {
      return <ErrorScreen title={this.t('titles.networkNotSupported')} chainId={capitalize({ string: defineNetworkName({ chainId }) })} error='NETWORK_NOT_SUPPORTED' />
    }
    switch (step) {
      case 1:
        // if has metamask extension => show screen with funds
        if (context.connectorName === 'MetaMask' && Number(chainId) === 4) {
          return <MetamaskInjectedScreen
            account={context.account}
            onFinish={_ => {
              this.actions().user.setStep({ step: 2 })
            }}
          />
        }
        // screen with proxy adress where to send tokens
        return <TokensSend
          startCheckingBalanceImmediately={startCheckingBalanceImmediately}
          onFinish={_ => {
            this.actions().user.setStep({ step: 2 })
          }}
        />
      case 2:
        // screen with link to share
        return <LinkShare
          connector={context.connectorName}
          account={context.account}
          onClick={_ => {
            this.actions().user.setStep({ step: 3 })
          }}
        />
      case 3:
        // screen with pro solutions we offer
        return <ProSolution
          onClose={_ => {
            this.actions().user.setStep({ step: 4 })
          }}
        />
      case 4:
        // final screen with link
        return <FinalScreen />
      default:
        // loading screen
        return <LoadingScreen />
    }
  }
}

export default Main
