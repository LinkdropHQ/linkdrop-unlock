import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { ProgressBar } from 'components/common'

@actions(({
  user: {
    currentAddress,
    chainId,
    version
  },
  tokens: {
    standard
  },
  campaigns: {
    ethAmount,
    tokenAmount,
    linksAmount,
    tokenSymbol,
    links
  }
}) => ({
  ethAmount,
  currentAddress,
  tokenAmount,
  linksAmount,
  links,
  tokenSymbol,
  chainId,
  version,
  standard
}))
@translate('pages.campaignCreate')
class Step5 extends React.Component {
  componentDidMount () {
    const { chainId, currentAddress } = this.props
    this.actions().user.prepareVersionVar({ chainId, currentAddress })
  }

  componentWillReceiveProps ({ links, version }) {
    const {
      linksAmount,
      links: prevLinks,
      chainId,
      currentAddress,
      version: prevVersion,
      standard
    } = this.props
    // save campaign when links ready
    if (links.length === linksAmount) {
      return this.actions().campaigns.save({ links })
    }

    if (
      (links && links.length > 0 && links.length > prevLinks.length && links.length < linksAmount) ||
      (version != null && !prevVersion && prevVersion !== version)
    ) {
      this.actions().tokens.generateERC20Link({ chainId, currentAddress, standard })
    }
  }

  render () {
    const { linksAmount, links } = this.props
    console.log({ linksAmount, links })
    return <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>{this.t('titles.generatingLinks')}</div>
        <div className={styles.subtitle} dangerouslySetInnerHTML={{ __html: this.t('titles.loadingProcess') }} />
        <ProgressBar current={links.length} max={linksAmount} />
      </div>
    </div>
  }
}

export default Step5
