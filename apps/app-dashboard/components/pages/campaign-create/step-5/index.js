import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Button, PageHeader } from 'components/common'
import { Loading, Icons } from 'linkdrop-ui-kit'
import { defineNetworkName } from 'linkdrop-commons'

@actions(({ user: { loading, chainId }, campaigns: { items, current } }) => ({ chainId, items, current, loading }))
@translate('pages.campaignCreate')
class Step5 extends React.Component {
  render () {
    const { items, current, campaignToCheck, loading, chainId } = this.props
    const currentCampaign = items.find(item => item.id === (campaignToCheck || current))
    const links = (currentCampaign || {}).links
    if (!currentCampaign) { return null }
    return <div className={styles.container}>
      <PageHeader title={this.t('titles.getTheLinks')} />
      {loading && <Loading withOverlay />}
      <div className={styles.content}>
        <div className={styles.automatic}>

          <p className={styles.text}>{this.t('titles.linkdropSdk')}</p>
          <p className={classNames(styles.text, styles.textGrey, styles.textMargin40)}>{this.t('titles.automaticDistribution')}</p>

          <Button onClick={_ => window.open('https://github.com/LinkdropProtocol/linkdrop-monorepo/tree/master/sdk', '_blank')} className={classNames(styles.button, styles.buttonMargin40, styles.buttonWithImg)}>
            <span>{this.t('buttons.useLinkdropSdk')}</span><Icons.ExternalLink fill='#FFF' />
          </Button>
          <p className={classNames(styles.text, styles.textMargin80)}>{this.t('titles.nodeJsSupport')}</p>
          <p className={classNames(styles.text, styles.textMargin20)}>{this.t('titles.codeDetails')}</p>
          <xmp className={styles.codeBlock}>
            {this.t('texts.codeBlock', {
              chain: defineNetworkName({ chainId: 1 }),
              masterAddress: currentCampaign.currentAddress,
              campaignId: currentCampaign.campaignId
            })}
          </xmp>
        </div>
        <div className={styles.manual}>
          <p className={styles.text}>{this.t('titles.downloadFile')}</p>
          <p className={classNames(styles.text, styles.textGrey, styles.textMargin40)}>{this.t('titles.manual')}</p>
          <div className={styles.buttonsContainer}>
            <Button onClick={_ => links && this.actions().campaigns.getCSV({ links, id: campaignToCheck || current })} className={styles.button}>{this.t('buttons.downloadCsv')}</Button>
            <Button transparent className={classNames(styles.button, styles.buttonWithImg)}><span>{this.t('buttons.qr')}</span><Icons.ExternalLink /></Button>
          </div>
          <p className={classNames(styles.text, styles.textMargin60)} dangerouslySetInnerHTML={{ __html: this.t('titles.howToClaimPreview') }} />
          <p className={classNames(styles.text, styles.textBold)}>{this.t('titles.faq')}</p>
          <p className={classNames(styles.text, styles.textMargin20)} dangerouslySetInnerHTML={{ __html: this.t('titles.visitHelpCenter', { href: 'https://www.notion.so/Help-Center-9cf549af5f614e1caee6a660a93c489b' }) }} />
          <p className={classNames(styles.text, styles.textMargin20)} dangerouslySetInnerHTML={{ __html: this.t('titles.customizations') }} />
          <p className={classNames(styles.text, styles.textMargin20)} dangerouslySetInnerHTML={{ __html: this.t('titles.pauseOrStop') }} />
          <p className={classNames(styles.text, styles.textMargin20)} dangerouslySetInnerHTML={{ __html: this.t('titles.analytics') }} />
        </div>
      </div>
      <div>
        <p className={classNames(styles.text, styles.textMargin20)}>{this.t('titles.contractParams')}</p>
        <p className={classNames(styles.text, styles.textMargin10, styles.ellipsis)} dangerouslySetInnerHTML={{ __html: this.t('titles.masterAddress', { address: currentCampaign.currentAddress }) }} />
        <p className={classNames(styles.text, styles.textMargin10, styles.ellipsis)} dangerouslySetInnerHTML={{ __html: this.t('titles.signingKey', { signingKey: currentCampaign.privateKey }) }} />
        <p className={classNames(styles.text, styles.ellipsis)} dangerouslySetInnerHTML={{ __html: this.t('titles.campaignId', { campaignId: currentCampaign.campaignId }) }} />
      </div>
    </div>
  }
}

export default Step5
