import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { ProgressBar } from 'components/common'

@actions(({
  user: {
    currentAddress,
    chainId
  },
  campaigns: {
    ethAmount,
    tokenAmount,
    linksAmount,
    tokenSymbol,
    tokenType,
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
  tokenType
}))
@translate('pages.campaignCreate')
class Step4 extends React.Component {
  componentDidMount () {
    const { chainId, currentAddress, tokenType } = this.props
    if (tokenType === 'eth') {
      this.actions().tokens.generateETHLink({ chainId, currentAddress })
    } else if (tokenType === 'erc20') {
      this.actions().tokens.generateERC20Link({ chainId, currentAddress })
    }
  }

  componentWillReceiveProps ({ links }) {
    const {
      linksAmount,
      links: prevLinks,
      chainId,
      currentAddress,
      tokenType
    } = this.props
    // save campaign when links ready
    if (links.length === linksAmount) {
      return this.actions().campaigns.save({ links })
    }
    if (links && links.length > 0 && links.length > prevLinks.length && links.length < linksAmount) {
      if (tokenType === 'eth') {
        this.actions().tokens.generateETHLink({ chainId, currentAddress })
      } else if (tokenType === 'erc20') {
        this.actions().tokens.generateERC20Link({ chainId, currentAddress })
      }
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

export default Step4
