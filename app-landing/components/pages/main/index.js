import React from 'react'
import { actions, translate } from 'decorators'
import { Button, Icons, Input } from 'linkdrop-ui-kit'
import styles from './styles.module'
import TokensSend from './tokens-send'
import LinkShare from './link-share'
import ProSolution from './pro-solution'
import FinalScreen from './final-screen'
import LearnMore from './learn-more'
import TrustedBy from './trusted-by'
import LoadingScreen from './loading-screen'

@actions(({ user: { step, balance, wallet } }) => ({ step, balance, wallet }))
@translate('pages.main')
class Main extends React.Component {
  componentDidMount () {
    const { wallet } = this.props
    if (!wallet) {
      this.actions().user.createWallet()
    }
  }

  componentWillReceiveProps ({ wallet, step }) {
    const { step: prevStep, wallet: prevWallet } = this.props
    if (step != null && step === 0 && wallet && wallet !== prevWallet) {
      return this.actions().tokens.checkBalance({ account: wallet })
    }

    if (
      step === 0 && // step property gets value 0
      prevStep !== 0 && // previous value of step property wasn't 0
      prevStep != null && // previous step isn't null
      wallet === null && // new value of wallet property is null
      prevWallet != null // previous value of wallet property wasn't equal to null
    ) {
      this.actions().user.createWallet() // that means we have to create new wallet
    }
  }

  render () {
    const { step } = this.props
    return <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.leftBlock}>
          {this.renderContent({ step })}
        </div>
        <div className={styles.rightBlock}>
          {this.renderTexts({ step })}
        </div>
      </div>
      <LearnMore />
      <TrustedBy />
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
        <Input className={styles.input} placeholder={this.t('titles.yourEmail')} />
        <Button className={styles.button}>{this.t('buttons.requestAccess')}</Button>
      </div>
      <div className={styles.formNote}>
        {this.t('titles.wantMoreLinksInstruction')}
      </div>
    </div>
  }

  renderContent ({ step }) {
    switch (step) {
      case 1:
        // screen with proxy adress where to send tokens
        return <TokensSend
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
