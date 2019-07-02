import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Web3Consumer } from 'web3-react'
import { Button } from 'components/common'

@actions(({ campaigns: { ethAmount, tokenAmount, linksAmount, tokenSymbol } }) => ({ ethAmount, tokenAmount, linksAmount, tokenSymbol }))
@translate('pages.campaignCreate')
class Step6 extends React.Component {
  render () {
    return <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.automatic}>
          <div className={styles.title}>{this.t('titles.getTheLinks')}</div>
          <p className={styles.text}>{this.t('titles.linkdropSdk')}</p>
          <p className={classNames(styles.text, styles.textGrey, styles.textMargin40)}>{this.t('titles.automaticDistribution')}</p>
          <p className={styles.text}>{this.t('titles.nodeJsSupport')}</p>
          <p className={styles.text}>{this.t('titles.otherPlatforms')}</p>
          <p className={classNames(styles.text, styles.textMargin20)}>{this.t('titles.contactUs')}</p>
          <Button className={classNames(styles.button, styles.buttonMargin60)}>{this.t('buttons.useLinkdropSdk')}</Button>
          <p className={classNames(styles.text, styles.textMargin20)}>{this.t('titles.codeDetails')}</p>
          <div className={styles.codeBlock}>s</div>
          <p className={classNames(styles.text, styles.textMargin10)}>{this.t('titles.contractParams')}</p>
          <p className={classNames(styles.text, styles.textMargin10)}>{this.t('titles.address', { address: 'asdasdasd' })}</p>
          <p className={classNames(styles.text, styles.textMargin10)}>{this.t('titles.verificationKey', { verificationKey: 'asdasdasd' })}</p>
        </div>
        <div className={styles.manual}>
          <p className={styles.text}>{this.t('titles.downloadFile')}</p>
          <p className={classNames(styles.text, styles.textGrey, styles.textMargin40)}>{this.t('titles.manual')}</p>
          <div className={styles.buttonsContainer}>
            <Button className={styles.button}>{this.t('buttons.downlpadCsv')}</Button>
            <Button transparent className={styles.button}>{this.t('buttons.qr')}</Button>
          </div>
          <p className={classNames(styles.text, styles.textMargin60)} dangerouslySetInnerHTML={{ __html: this.t('titles.howToClaimPreview') }} />
          <p className={classNames(styles.text, styles.textBold)}>{this.t('titles.faq')}</p>
          <p className={classNames(styles.text, styles.textMargin20)}>{this.t('titles.visitHelpCenter')}</p>
          <p className={classNames(styles.text, styles.textMargin20)}>{this.t('titles.customizations')}</p>
          <p className={classNames(styles.text, styles.textMargin20)}>{this.t('titles.pauseOrStop')}</p>
          <p className={classNames(styles.text, styles.textMargin20)}>{this.t('titles.analytics')}</p>
        </div>
      </div>
    </div>
  }
}

export default Step6
