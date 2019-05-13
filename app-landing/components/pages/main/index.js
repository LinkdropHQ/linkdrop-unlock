import React from 'react'
import { actions, translate } from 'decorators'
import { Button, Icons } from 'linkdrop-ui-kit'
import styles from './styles.module'
import TokensSend from './tokens-send'
import LinkShare from './link-share'
import ProSolution from './pro-solution'
import FinalScreen from './final-screen'
import LearnMore from './learn-more'
import TrustedBy from './trusted-by'
import LoadingScreen from './loading-screen'
import ErrorScreen from './error-screen'
import { getHashVariables } from 'linkdrop-commons'

@actions(({ user: { step, balance, wallet, link, errors } }) => ({ step, balance, wallet, link, errors }))
@translate('pages.main')
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      startCheckingBalanceImmediately: false
    }
  }
  componentDidMount () {
    const { n } = getHashVariables()
    const { wallet } = this.props
    // if has no wallet, then generate new one
    if (!wallet) {
      return this.actions().user.createWallet()
    }
    // otherwise do the initial check
    this.setState({
      startCheckingBalanceImmediately: true
    }, _ => this.actions().tokens.checkBalance({ account: wallet, networkId: n }))
  }

  componentWillReceiveProps ({ wallet, step }) {
    const { n } = getHashVariables()
    const { wallet: prevWallet } = this.props
    if (step != null && step === 0 && wallet && wallet !== prevWallet) {
      return this.actions().tokens.checkBalance({ account: wallet, networkId: n })
    }
  }

  render () {
    const { step, errors } = this.props
    return <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.leftBlock}>
          {this.renderContent({ step, errors })}
        </div>
        <div className={styles.rightBlock}>
          {this.renderTexts({ step })}
        </div>
      </div>
      {/* currently disabled */}
      {false && <LearnMore />}
      {false && <TrustedBy />}
      {/* currently disabled */}
    </div>
  }

  renderTexts ({ step }) {
    return <div className={styles.texts}>
      <h1 className={styles.mainTitle}>
        {this.t('titles.main')}
      </h1>
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

  renderContent ({ step, errors }) {
    const { startCheckingBalanceImmediately } = this.state
    switch (step) {
      case 1:
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
