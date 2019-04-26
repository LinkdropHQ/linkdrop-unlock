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

@actions(({ user: { step } }) => ({ step }))
@translate('pages.main')
class Main extends React.Component {
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
      case 0:
        return <TokensSend
          onClick={_ => {
            this.actions().user.setStep({ step: 2 })
          }}
        />
      case 2:
        return <LinkShare
          onClick={_ => {
            this.actions().user.setStep({ step: 3 })
          }}
        />
      case 3:
        return <ProSolution
          onClose={_ => {
            this.actions().user.setStep({ step: 4 })
          }}
        />
      case 4:
        return <FinalScreen />
      default:
        return null
    }
  }
}

export default Main
