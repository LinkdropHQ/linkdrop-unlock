import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Button, PageHeader } from 'components/common'
import { Loading } from 'linkdrop-ui-kit'

@actions(({ user: { loading }, campaigns: { items, current } }) => ({ items, current, loading }))
@translate('pages.campaignCreate')
class Step5 extends React.Component {
  render () {
    const { items, current, campaignToCheck, loading } = this.props
    const currentCampaign = items.find(item => item.id === campaignToCheck || current)
    const links = (currentCampaign || {}).links
    console.log({ currentCampaign })
    return <div className={styles.container}>
      {loading && <Loading withOverlay />}
      <div className={styles.content}>
        <div className={styles.automatic}>
          <PageHeader title={this.t('titles.getTheLinks')} />
          <p className={styles.text}>{this.t('titles.linkdropSdk')}</p>
          <p className={classNames(styles.text, styles.textGrey, styles.textMargin40)}>{this.t('titles.automaticDistribution')}</p>
          <p className={styles.text}>{this.t('titles.nodeJsSupport')}</p>
          <p className={styles.text}>{this.t('titles.otherPlatforms')}</p>
          <p className={classNames(styles.text, styles.textMargin20)}>{this.t('titles.contactUs')}</p>
          <Button className={classNames(styles.button, styles.buttonMargin60)}>{this.t('buttons.useLinkdropSdk')}</Button>
          {false && <div>
            <p className={classNames(styles.text, styles.textMargin20)}>{this.t('titles.codeDetails')}</p>
            <textarea disabled className={styles.codeBlock}>
              {this.t('texts.codeBlock')}
            </textarea>
          </div>}
        </div>
        <div className={styles.manual}>
          <p className={styles.text}>{this.t('titles.downloadFile')}</p>
          <p className={classNames(styles.text, styles.textGrey, styles.textMargin40)}>{this.t('titles.manual')}</p>
          <div className={styles.buttonsContainer}>
            <Button onClick={_ => links && this.actions().campaigns.getCSV({ links, id: campaignToCheck || current })} className={styles.button}>{this.t('buttons.downloadCsv')}</Button>
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
      <p className={classNames(styles.text, styles.textMargin15)}>{this.t('titles.contractParams')}</p>
      <p className={classNames(styles.text, styles.textMargin10)} dangerouslySetInnerHTML={{ __html: this.t('titles.masterAddress', { address: currentCampaign.currentAddress }) }} />
      <p className={classNames(styles.text, styles.textMargin10)} dangerouslySetInnerHTML={{ __html: this.t('titles.signingKey', { signingKey: currentCampaign.privateKey }) }} />
    </div>
  }
}

export default Step5
