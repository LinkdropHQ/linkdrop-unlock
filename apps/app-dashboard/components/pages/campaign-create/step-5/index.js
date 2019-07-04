import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Web3Consumer } from 'web3-react'
import { ProgressBar } from 'components/common'

@actions(({ user: { currentAddress, chainId }, campaigns: { ethAmount, tokenAmount, linksAmount, tokenSymbol, links } }) => ({ ethAmount, currentAddress, tokenAmount, linksAmount, links, tokenSymbol, chainId }))
@translate('pages.campaignCreate')
class Step5 extends React.Component {
  componentDidMount () {
    const { chainId, currentAddress } = this.props
    this.actions().tokens.generateERC20Link({ chainId, currentAddress })
  }

  componentWillReceiveProps ({ links }) {
    const { linksAmount, links: prevLinks, chainId, currentAddress } = this.props
    if (links.length === linksAmount) {
      return this.actions().campaigns.save({ links })
    }
    if (links && links.length > 0 && links.length > prevLinks.length && links.length < linksAmount) {
      this.actions().tokens.generateERC20Link({ chainId, currentAddress })
    }
  }

  render () {
    const { linksAmount, links } = this.props
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
