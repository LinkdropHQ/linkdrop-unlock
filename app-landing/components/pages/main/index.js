import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from 'linkdrop-ui-kit'
import styles from './styles.module'

import TokensAmount from './tokens-amount'
import TokensSend from './tokens-send'
import LinkShare from './link-share'
import ProSolution from './pro-solution'

@actions(({ user: { step } }) => ({ step }))
@translate('pages.main')
class Main extends React.Component {
  render () {
    const { step } = this.props
    return <div className={styles.container}>
      <div className={styles.leftBlock}>
        {this.renderContent({ step })}
      </div>
      <div className={styles.rightBlock}>
        {this.renderTexts({ step })}
      </div>
    </div>
  }

  renderTexts ({ step }) {
    const lastStep = step === 3
    const title = lastStep ? this.t('titles.tryLinkdropPro') : this.t('titles.main')
    const description = lastStep ? this.t('descriptions.tryLinkdropPro') : this.t('descriptions.main')
    return <div>
      <h1 className={styles.mainTitle}>
        {title}
      </h1>
      <div className={styles.mainDescription}>
        {description}
      </div>
      {lastStep && <Button inverted>{this.t('buttons.campaign')}</Button>}
    </div>
  }

  renderContent ({ step }) {
    switch (step) {
      case 0:
        return <TokensAmount
          onClick={({ value }) => {
            this.actions().tokens.setAmount({ amount: value })
            this.actions().user.setStep({ step: 1 })
          }}
        />
      case 1:
        return <TokensSend
          onClick={_ => {
            this.actions().user.setStep({ step: 2 })
          }}
        />
      case 2:
        return <LinkShare
          onClick={_ => {
            console.log('bla')
            this.actions().user.setStep({ step: 3 })
          }}
        />
      case 3:
        return <ProSolution />
    }
  }
}

export default Main
